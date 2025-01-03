import {
  Attachment as AttachmentModel,
  Message as MessageModel,
  Prisma,
  PrismaClient,
  RoomType,
} from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"

import { ERROR } from "@/constants/error"
import AuthorizationError from "@/lib/exceptions/authorization-error"
import InvariantError from "@/lib/exceptions/invariant-error"
import { prisma } from "@/lib/prisma"

import { getMessageInludeQuery } from "./utils"

export const validateMessage = async ({
  roomType,
  userId,
  receiverId,
  parentMessageId,
}: {
  roomType: RoomType
  receiverId: string
  userId: string
  parentMessageId?: string
}): Promise<void> => {
  if (roomType === "PRIVATE") {
    const blockingUser = await prisma.blockedUser.findFirst({
      where: { blockedUserId: receiverId, userId, unblockedAt: null },
    })

    if (blockingUser) {
      throw new AuthorizationError(ERROR.CANNOT_SEND_MESSAGE_TO_BLOCKED_USER)
    }
  }

  if (roomType === "GROUP") {
    const group = await prisma.group.findUnique({
      where: { id: receiverId },
      select: {
        id: true,
        members: { where: { userId, leftAt: null } },
      },
    })
    if (!group) {
      throw new AuthorizationError(ERROR.GROUP_NOT_FOUND)
    }
    if (group.members.length === 0) {
      throw new AuthorizationError(ERROR.NOT_GROUP_MEMBER)
    }
  }

  if (roomType === "CHANNEL") {
    const channel = await prisma.channel.findFirst({
      where: { id: receiverId },
      select: {
        id: true,
        subscribers: {
          where: { userId, unsubscribedAt: null },
        },
      },
    })
    if (!channel) {
      throw new InvariantError(ERROR.CHANNEL_NOT_FOUND)
    }
    if (channel.subscribers.length === 0 || !channel.subscribers[0]?.isAdmin) {
      throw new AuthorizationError(ERROR.USER_IS_NOT_ADMIN)
    }
  }

  if (!parentMessageId) return undefined
  const parentMessage = await prisma.message.findUnique({
    where: { id: parentMessageId },
    select: {
      id: true,
      privateChat:
        roomType === "PRIVATE"
          ? { select: { user1Id: true, user2Id: true } }
          : false,
      groupId: roomType === "GROUP",
      channelId: roomType === "CHANNEL",
    },
  })

  if (parentMessageId) {
    if (!parentMessage) {
      throw new InvariantError(ERROR.MESSAGE_NOT_FOUND)
    }

    if (
      parentMessage.privateChat &&
      !(
        parentMessage.privateChat.user1Id === receiverId &&
        parentMessage.privateChat.user2Id === userId
      ) &&
      !(
        parentMessage.privateChat.user2Id === receiverId &&
        parentMessage.privateChat.user1Id === userId
      )
    ) {
      throw new InvariantError(ERROR.PARENT_MESSAGE_NOT_IN_ROOM)
    } else if (parentMessage.groupId && parentMessage.groupId !== receiverId) {
      throw new InvariantError(ERROR.PARENT_MESSAGE_NOT_IN_ROOM)
    } else if (
      parentMessage.channelId &&
      parentMessage.channelId !== receiverId
    ) {
      throw new InvariantError(ERROR.PARENT_MESSAGE_NOT_IN_ROOM)
    }
  }

  return undefined
}

const createMessage = async (
  tx: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  {
    message,
    roomType,
    senderId,
    receiverId,
    isEmojiOnly,
    originalMessageId,
    parentMessageId,
    attachments,
  }: Pick<
    MessageModel,
    | "message"
    | "isEmojiOnly"
    | "originalMessageId"
    | "parentMessageId"
    | "senderId"
  > & {
    receiverId: string
    roomType: RoomType
    attachments: Pick<
      AttachmentModel,
      "name" | "size" | "type" | "url" | "downloadUrl"
    >[]
  },
) => {
  const parentMessage = parentMessageId
    ? await tx.message.findUnique({
        where: { id: parentMessageId },
        select: {
          id: true,
          message: true,
          sender: { select: { profile: { select: { name: true } } } },
        },
      })
    : undefined

  return tx.message.create({
    data: {
      message,
      senderId,
      privateChatId: roomType === "PRIVATE" ? receiverId : undefined,
      groupId: roomType === "GROUP" ? receiverId : undefined,
      channelId: roomType === "CHANNEL" ? receiverId : undefined,
      originalMessageId,
      parentMessageId: parentMessage?.id ?? undefined,
      parentMessageName: parentMessage?.sender.profile?.name ?? undefined,
      parentMessageText: parentMessage?.message ?? undefined,
      status: "DEFAULT",
      isEmojiOnly,
      attachments:
        attachments.length > 0
          ? {
              createMany: {
                data: attachments.map((att) => ({
                  name: att.name,
                  size: att.size,
                  type: att.type,
                  url: att.url,
                  downloadUrl: att.downloadUrl,
                })),
              },
            }
          : undefined,
    },
    include: { ...getMessageInludeQuery() },
  })
}

export const initiatePrivateMessage = async (
  tx: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  messageModel: Pick<
    MessageModel,
    | "message"
    | "isEmojiOnly"
    | "originalMessageId"
    | "parentMessageId"
    | "senderId"
  > & {
    receiverId: string
    roomType: RoomType
    isBlocked: boolean
    attachments: Pick<
      AttachmentModel,
      "name" | "size" | "type" | "url" | "downloadUrl"
    >[]
  },
) => {
  const { receiverId, senderId, isBlocked } = messageModel

  const privateChat = await tx.privateChat.create({
    data: {
      user1Id: senderId,
      user2Id: receiverId,
      rooms: {
        createMany: {
          data: [
            { ownerId: senderId, type: "PRIVATE" },
            ...(senderId !== receiverId
              ? [
                  {
                    ownerId: receiverId,
                    type: RoomType.PRIVATE,
                    deletedAt: isBlocked ? new Date() : null,
                  },
                ]
              : []),
          ],
        },
      },
      usersOption: {
        createMany: {
          data: [
            { userId: senderId, notification: senderId !== receiverId },
            ...(senderId !== receiverId
              ? [{ userId: receiverId, notification: true }]
              : []),
          ],
        },
      },
    },
    include: { rooms: true },
  })

  const createdMessage = await createMessage(tx, {
    ...messageModel,
    receiverId: privateChat.id,
  })

  await tx.room.updateMany({
    where: {
      privateChatId: privateChat.id,
      OR: [
        { ownerId: senderId },
        { ownerId: isBlocked ? senderId : receiverId },
      ],
    },
    data: {
      lastMessageId: createdMessage.id,
    },
  })

  if (senderId !== receiverId) {
    await tx.userUnreadMessage.createMany({
      data: privateChat.rooms.map((room) => ({
        userId: room.ownerId,
        roomId: room.id,
        count: room.ownerId !== senderId ? 1 : 0,
      })),
    })
  }

  return createdMessage
}

export const sendMessage = async (
  messageModel: Pick<
    MessageModel,
    | "message"
    | "isEmojiOnly"
    | "originalMessageId"
    | "parentMessageId"
    | "senderId"
  > & {
    receiverId: string
    roomType: RoomType
    attachments: Pick<
      AttachmentModel,
      "name" | "size" | "type" | "url" | "downloadUrl"
    >[]
  },
) => {
  const { roomType, receiverId, senderId } = messageModel

  return prisma.$transaction(async (tx) => {
    if (roomType === "PRIVATE") {
      const blockedUser = await tx.blockedUser.findFirst({
        where: {
          blockedUserId: senderId,
          userId: receiverId,
          unblockedAt: null,
        },
      })
      const isBlocked = !!blockedUser
      const privateChat = await tx.privateChat.findFirst({
        where: {
          OR: [
            { user1Id: senderId, user2Id: receiverId },
            { user2Id: senderId, user1Id: receiverId },
          ],
        },
        include: {
          usersOption: {
            where: { userId: { in: [senderId, receiverId] } },
          },
          rooms: { select: { id: true, ownerId: true } },
        },
      })

      if (!privateChat) {
        const createdMessage = await initiatePrivateMessage(tx, {
          ...messageModel,
          isBlocked,
        })

        return createdMessage
      } else {
        const createdMessage = await createMessage(tx, {
          ...messageModel,
          receiverId: privateChat.id,
        })

        await tx.room.updateMany({
          where: { ownerId: senderId, privateChatId: privateChat.id },
          data: {
            deletedAt: null,
            archivedAt: null,
            lastMessageId: createdMessage.id,
          },
        })
        if (!isBlocked) {
          await tx.room.updateMany({
            where: { ownerId: receiverId, privateChatId: privateChat.id },
            data: {
              deletedAt: null,
              lastMessageId: createdMessage.id,
            },
          })
        }

        const senderOption = privateChat.usersOption.find(
          (v) => v.userId === senderId,
        )
        await tx.privateChatOption.upsert({
          where: { id: senderOption?.id ?? "", deletedAt: null },
          create: {
            userId: senderId,
            privateChatId: privateChat.id,
            notification: true,
            createdAt: createdMessage.createdAt,
          },
          update: {},
        })

        if (senderId !== receiverId) {
          const receiverOption = privateChat.usersOption.find(
            (v) => v.userId === receiverId,
          )
          await tx.privateChatOption.upsert({
            where: { id: receiverOption?.id ?? "", deletedAt: null },
            create: {
              userId: receiverId,
              privateChatId: privateChat.id,
              notification: true,
              createdAt: createdMessage.createdAt,
            },
            update: {},
          })
        }

        if (senderId !== receiverId && !isBlocked) {
          const receiverRoom = privateChat.rooms.find(
            (room) => room.ownerId === receiverId,
          )
          if (receiverRoom) {
            await tx.userUnreadMessage.update({
              where: { roomId: receiverRoom.id },
              data: { count: { increment: 1 } },
            })
          }
        }

        return createdMessage
      }
    }

    const createdMessage = await createMessage(tx, {
      ...messageModel,
      receiverId,
    })

    if (roomType === "GROUP") {
      await tx.room.updateMany({
        where: { groupId: receiverId, deletedAt: null },
        data: { lastMessageId: createdMessage.id },
      })

      await tx.userUnreadMessage.updateMany({
        where: { room: { groupId: receiverId, ownerId: { not: senderId } } },
        data: { count: { increment: 1 } },
      })
    }

    if (roomType === "CHANNEL") {
      await tx.room.updateMany({
        where: { channelId: receiverId, deletedAt: null },
        data: { lastMessageId: createdMessage.id },
      })

      await tx.userUnreadMessage.updateMany({
        where: { room: { channelId: receiverId, ownerId: { not: senderId } } },
        data: { count: { increment: 1 } },
      })
    }

    return createdMessage
  })
}
