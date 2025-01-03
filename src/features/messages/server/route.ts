import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { Models } from "node-appwrite"

import { collectionSchema } from "@/constants"
import { ERROR } from "@/constants/error"
import {
  constructDownloadUrl,
  constructFileUrl,
  destructFileId,
} from "@/lib/appwrite"
import AuthorizationError from "@/lib/exceptions/authorization-error"
import InvariantError from "@/lib/exceptions/invariant-error"
import NotFoundError from "@/lib/exceptions/not-found-error"
import { prisma } from "@/lib/prisma"
import { sessionMiddleware } from "@/lib/session-middleware"
import { deleteFile, uploadFile } from "@/lib/upload-file"
import { successCollectionResponse, successResponse } from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"

import { sendMessage, validateMessage } from "../lib/queries"
import {
  getFileType,
  getMessageInludeQuery,
  mapMessageModelToMessage,
} from "../lib/utils"
import {
  createMessageSchema,
  forwardMessageSchema,
  getMessageParamSchema,
  updateMessageSchema,
} from "../schema"

/**
 * RULES:
 * 1. To private message
 *   - Tidak bisa kirim pesan jika memblock receiver
 *   - Belum pernah kontak:
 *     * buat private chat
 *     * buat room untuk keduanya jika tidak diblock
 *     * buat room untuk sender saja jika di block
 *     * buat private chat options untuk keduanya
 *     * update sender last message read
 *
 *   - sudah ada private chat (pernah kontak):
 *     * munculkan room jika tidak diblock
 *     * buat private chat options untuk keduanya jika belum ada
 *     * update sender last message read
 *
 * 2. Group
 *   - Harus member group
 *   - update room last message semua member
 *   - update sender last message read
 * 2. Channel
 *   - Harus admin channel
 *   - update room last message semua subscriber
 *   - update sender last message read
 */

const messageApp = new Hono()
  .post(
    "/",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("form", createMessageSchema),
    async (c) => {
      const {
        receiverId,
        roomType,
        attachments: formAttachments,
        parentMessageId,
        message,
        isEmojiOnly,
      } = c.req.valid("form")

      const { userId } = c.get("userProfile")

      await validateMessage({
        receiverId,
        roomType,
        parentMessageId,
        userId,
      })

      const attachments = formAttachments
        ? Array.isArray(formAttachments)
          ? formAttachments
          : [formAttachments]
        : []
      let files: Models.File[] = []
      if (attachments?.length > 0) {
        files = await Promise.all(
          attachments.map((v) => uploadFile({ file: v })),
        )
      }

      try {
        const createdMessage = await sendMessage({
          message: message ?? null,
          roomType,
          receiverId,
          senderId: userId,
          isEmojiOnly: isEmojiOnly ?? false,
          originalMessageId: null,
          parentMessageId: parentMessageId ?? null,
          attachments: files.map((att) => ({
            name: att.name,
            size: att.sizeOriginal,
            type: getFileType(att.mimeType),
            url: constructFileUrl(att.$id),
            downloadUrl: constructDownloadUrl(att.$id),
          })),
        })

        const response: CreateMessageResponse = successResponse(
          mapMessageModelToMessage(userId, createdMessage),
        )
        return c.json(response)
      } catch {
        if (files.length > 0) {
          await Promise.all(files.map((file) => deleteFile({ id: file.$id })))
        }
        throw new Error(ERROR.INTERNAL_SERVER_ERROR)
      }
    },
  )
  /**
   * RULES:
   * 1. Private Chat
   *   - filter pesan berdasarkan:
   *     * privateChatOption: createdAt <= x < deletedAt
   *     * blockedUsers: x < blockedAt && x > unblockedAt
   *
   * 2. Group
   *   - filter pesan berdasarkan:
   *     * groupMembers: createdAt <= x < leftAt
   *
   * 2. Channel
   *   - filter pesan berdasarkan:
   *     * channelSubscribers: createdAt <= x < unsubscribedAt
   */
  .get(
    "/:roomType/:receiverId",
    zValidator("param", getMessageParamSchema),
    zValidator("query", collectionSchema),
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const { receiverId, roomType } = c.req.valid("param")
      const { limit, cursor } = c.req.valid("query")

      const { userId } = c.get("userProfile")

      const where = []
      if (roomType === "PRIVATE") {
        const chatOptions = await prisma.privateChatOption.findMany({
          where: {
            userId,
            privateChat: {
              OR: [{ user2Id: receiverId }, { user1Id: receiverId }],
            },
          },
        })
        const datesOption = chatOptions.map((opt) => {
          return {
            createdAt: {
              gte: opt.createdAt,
              lt: opt.deletedAt ?? new Date(),
            },
          }
        })

        const blockeds =
          userId !== receiverId
            ? await prisma.blockedUser.findMany({
                where: { blockedUserId: receiverId, userId },
              })
            : []
        const datesBlocked = blockeds.map((opt) => {
          return {
            OR: [
              { createdAt: { lt: opt.createdAt } },
              { createdAt: { gte: opt.unblockedAt ?? new Date() } },
            ],
          }
        })

        where.push({
          privateChat: {
            OR: [
              { user1Id: userId, user2Id: receiverId },
              { user2Id: userId, user1Id: receiverId },
            ],
          },
          OR: datesOption.length > 0 ? datesOption : [],
          AND: datesBlocked.length > 0 ? datesBlocked : undefined,
        })
      } else if (roomType === "GROUP") {
        const members = await prisma.groupMember.findMany({
          where: { userId, groupId: receiverId },
        })

        const datesMember = members.map((opt) => {
          return {
            createdAt: {
              gte: opt.createdAt,
              lt: opt.leftAt ?? new Date(),
            },
          }
        })

        where.push({
          groupId: receiverId,
          OR: datesMember.length > 0 ? datesMember : [],
        })
      } else if (roomType === "CHANNEL") {
        const subscribers = await prisma.channelSubscriber.findMany({
          where: { userId, channelId: receiverId },
        })

        const datesSubscribe = subscribers.map((opt) => {
          return {
            createdAt: {
              gte: opt.createdAt,
              lt: opt.unsubscribedAt ?? new Date(),
            },
          }
        })

        where.push({
          channelId: receiverId,
          OR: datesSubscribe.length > 0 ? datesSubscribe : [],
        })
      }

      const messages = await prisma.message.findMany({
        where: {
          ...where[0],
          status: { not: "DELETED_FOR_ME" },
        },
        orderBy: { createdAt: "desc" },
        include: { ...getMessageInludeQuery() },
        take: limit,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : undefined,
      })

      const total = messages.length
      const nextCursor =
        total > 0 && total === limit ? messages[total - 1].id : undefined

      const response: GetMessagesResponse = successCollectionResponse(
        messages.map((v) => mapMessageModelToMessage(userId, v)),
        total,
        nextCursor,
      )
      return c.json(response)
    },
  )
  .post(
    "/:roomType/:receiverId/read",
    zValidator("param", getMessageParamSchema),
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const { roomType, receiverId } = c.req.valid("param")

      const { userId } = c.get("userProfile")

      const room = await prisma.room.findFirst({
        where: {
          ownerId: userId,
          // type: roomType as RoomType,
          privateChat:
            roomType === "PRIVATE"
              ? {
                  OR: [
                    { user1Id: userId, user2Id: receiverId },
                    { user2Id: userId, user1Id: receiverId },
                  ],
                }
              : undefined,
          groupId: roomType === "GROUP" ? receiverId : undefined,
          channelId: roomType === "CHANNEL" ? receiverId : undefined,
        },
      })

      if (!room) {
        throw new NotFoundError(ERROR.ROOM_NOT_FOUND)
      }

      await prisma.userUnreadMessage.update({
        where: { roomId: room.id },
        data: { count: 0 },
      })

      const response: MarkMessageAsReadResponse = successResponse(true)
      return c.json(response)
    },
  )
  .put(
    "/:messageId",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("json", updateMessageSchema),
    async (c) => {
      const { messageId } = c.req.param()
      const { message: messageText, isEmojiOnly } = c.req.valid("json")

      const { userId } = c.get("userProfile")

      const originalMessage = await prisma.message.findUnique({
        where: { id: messageId },
      })
      if (!originalMessage) {
        throw new NotFoundError(ERROR.MESSAGE_NOT_FOUND)
      }

      if (originalMessage.senderId !== userId) {
        throw new AuthorizationError(ERROR.NOT_ALLOWED)
      }

      if (originalMessage.status !== "DEFAULT") {
        throw new AuthorizationError(ERROR.UPDATE_DELETED_MESSAGE_NOT_ALLOWED)
      }

      const result = await prisma.message.update({
        where: { id: messageId },
        data: { message: messageText, isEmojiOnly },
        include: { ...getMessageInludeQuery() },
      })

      const message = mapMessageModelToMessage(userId, result)

      const response: UpdateMessageResponse = successResponse(message)
      return c.json(response)
    },
  )
  .delete(
    "/:messageId/me",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const { messageId } = c.req.param()

      const { userId } = c.get("userProfile")

      const originalMessage = await prisma.message.findUnique({
        where: { id: messageId },
      })
      if (!originalMessage) {
        throw new NotFoundError(ERROR.MESSAGE_NOT_FOUND)
      }

      if (originalMessage.senderId !== userId) {
        throw new AuthorizationError(ERROR.NOT_ALLOWED)
      }

      if (originalMessage.status !== "DEFAULT") {
        throw new InvariantError(ERROR.MESSAGE_ALREADY_DELETED)
      }

      await prisma.message.update({
        where: { id: messageId },
        data: { status: "DELETED_FOR_ME" },
      })

      const response: DeleteMessageResponse = successResponse({
        id: messageId,
      })
      return c.json(response)
    },
  )
  .delete(
    "/:messageId/all",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const { messageId } = c.req.param()

      const { userId } = c.get("userProfile")

      const originalMessage = await prisma.message.findUnique({
        where: { id: messageId },
      })
      if (!originalMessage) {
        throw new NotFoundError(ERROR.MESSAGE_NOT_FOUND)
      }

      if (originalMessage.senderId !== userId) {
        throw new AuthorizationError(ERROR.NOT_ALLOWED)
      }

      if (originalMessage.status !== "DEFAULT") {
        throw new InvariantError(ERROR.MESSAGE_ALREADY_DELETED)
      }

      const result = await prisma.message.update({
        where: { id: messageId },
        data: {
          status: "DELETED_FOR_ALL",
          attachments: { deleteMany: { messageId } },
        },
        include: { attachments: { select: { url: true } } },
      })

      await Promise.all(
        result.attachments.map((attc) =>
          deleteFile({ id: destructFileId(attc.url) }),
        ),
      )

      const response: DeleteMessageResponse = successResponse({
        id: messageId,
      })
      return c.json(response)
    },
  )
  .delete(
    "/:messageId/admin",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const { messageId } = c.req.param()

      const { userId } = c.get("userProfile")

      const originalMessage = await prisma.message.findUnique({
        where: { id: messageId },
        include: {
          group: {
            select: {
              members: {
                where: { isAdmin: true },
                select: { userId: true },
              },
            },
          },
          channel: {
            select: {
              subscribers: {
                where: { isAdmin: true },
                select: { userId: true },
              },
            },
          },
        },
      })
      if (!originalMessage) {
        throw new NotFoundError(ERROR.MESSAGE_NOT_FOUND)
      }

      if (originalMessage.group) {
        const isAdmin = originalMessage.group.members.find(
          (u) => u.userId === userId,
        )
        if (!isAdmin) {
          throw new AuthorizationError(ERROR.NOT_ALLOWED)
        }
      }

      if (originalMessage.channel) {
        const isAdmin = originalMessage.channel.subscribers.find(
          (u) => u.userId === userId,
        )
        if (!isAdmin) {
          throw new AuthorizationError(ERROR.NOT_ALLOWED)
        }
      }

      if (originalMessage.status !== "DEFAULT") {
        throw new InvariantError(ERROR.MESSAGE_ALREADY_DELETED)
      }

      const result = await prisma.message.update({
        where: { id: messageId },
        data: {
          status: "DELETED_BY_ADMIN",
          attachments: { deleteMany: { messageId } },
        },
        include: { attachments: { select: { url: true } } },
      })
      await Promise.all(
        result.attachments.map((attc) =>
          deleteFile({ id: destructFileId(attc.url) }),
        ),
      )

      const response: DeleteMessageResponse = successResponse({
        id: messageId,
      })
      return c.json(response)
    },
  )
  .post(
    "/:messageId/forwarded",
    zValidator("json", forwardMessageSchema),
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const { messageId } = c.req.param()
      const { receiverId, roomType } = c.req.valid("json")

      const { userId } = c.get("userProfile")

      const originalMessage = await prisma.message.findUnique({
        where: { id: messageId },
        include: { ...getMessageInludeQuery() },
      })
      if (!originalMessage) {
        throw new InvariantError(ERROR.MESSAGE_NOT_FOUND, ["originalMessageId"])
      }

      const message = await sendMessage({
        receiverId,
        roomType,
        message: originalMessage.message,
        isEmojiOnly: originalMessage.isEmojiOnly,
        originalMessageId:
          originalMessage.senderId === userId ? null : messageId,
        senderId: userId,
        parentMessageId: null,
        attachments: originalMessage.attachments,
      })

      const response: ForwardMessageResponse = successResponse(
        mapMessageModelToMessage(userId, message),
      )
      return c.json(response)
    },
  )

export default messageApp
