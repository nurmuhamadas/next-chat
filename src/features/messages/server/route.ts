import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { Models } from "node-appwrite"

import { collectionSchema } from "@/constants"
import { ERROR } from "@/constants/error"
import { constructDownloadUrl, constructFileUrl } from "@/lib/appwrite"
import { prisma } from "@/lib/prisma"
import { sessionMiddleware } from "@/lib/session-middleware"
import { deleteFile, uploadFile } from "@/lib/upload-file"
import {
  createError,
  successCollectionResponse,
  successResponse,
} from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"
import { zodErrorHandler } from "@/lib/zod-error-handler"

import { sendMessage, validateMessage } from "../lib/queries"
import { getFileType, mapMessageModelToMessage } from "../lib/utils"
import { createMessageSchema, getMessageParamSchema } from "../schema"

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
    zValidator("form", createMessageSchema, zodErrorHandler),
    async (c) => {
      try {
        const {
          receiverId,
          roomType,
          attachments: formAttachments,
          originalMessageId,
          parentMessageId,
          message,
          isEmojiOnly,
        } = c.req.valid("form")

        const { userId } = c.get("userProfile")

        const invalid = await validateMessage({
          receiverId,
          roomType,
          originalMessageId,
          parentMessageId,
          userId,
        })
        if (invalid) {
          return c.json(createError(invalid.error, invalid.path), invalid.code)
        }

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
            originalMessageId: originalMessageId ?? null,
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
            mapMessageModelToMessage(createdMessage),
          )
          return c.json(response)
        } catch {
          if (files.length > 0) {
            await Promise.all(files.map((file) => deleteFile({ id: file.$id })))
          }
          return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
        }
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
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
      try {
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
            OR: datesOption.length > 0 ? datesOption : undefined,
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
            OR: datesMember.length > 0 ? datesMember : undefined,
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
            OR: datesSubscribe.length > 0 ? datesSubscribe : undefined,
          })
        }

        const messages = await prisma.message.findMany({
          where: {
            ...where[0],
            status: { not: "DELETED_FOR_ME" },
          },
          orderBy: { createdAt: "desc" },
          include: {
            attachments: true,
            repliedMessage: {
              select: {
                id: true,
                message: true,
                sender: {
                  select: {
                    id: true,
                    profile: { select: { name: true } },
                  },
                },
              },
            },
            sender: {
              select: {
                id: true,
                profile: { select: { name: true, imageUrl: true } },
              },
            },
          },
          take: limit,
          cursor: cursor ? { id: cursor } : undefined,
          skip: cursor ? 1 : undefined,
        })

        const total = messages.length
        const nextCursor =
          total > 0 && total === limit ? messages[total - 1].id : undefined

        const response: GetMessagesResponse = successCollectionResponse(
          messages.map(mapMessageModelToMessage),
          total,
          nextCursor,
        )
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
// .post(
//   "/private/:userId/read",
//   sessionMiddleware,
//   validateProfileMiddleware,
//   async (c) => {
//     try {
//       const { userId } = c.req.param()

//       const databases = c.get("databases")
//       const currentProfile = c.get("userProfile")

//       const conversation = await getConversationByUserIds(databases, {
//         userId1: currentProfile.$id,
//         userId2: userId,
//       })
//       if (!conversation) {
//         return c.json(createError(ERROR.CONVERSATION_NOT_FOUND), 404)
//       }
//       const conversationId = conversation.$id

//       const lastMessage = await getLastMessageByConversationId(databases, {
//         conversationId,
//       })
//       const lastMessageRead = await getLastConvMessageRead(databases, {
//         conversationId,
//         userId: currentProfile.$id,
//       })
//       if (!lastMessage) {
//         return c.json(createError(ERROR.NO_UNREAD_MESSAGE), 400)
//       }

//       if (
//         lastMessage?.$id.localeCompare(
//           lastMessageRead?.$id ?? lastMessage.$id,
//         ) < 0
//       ) {
//         return c.json(createError(ERROR.NO_UNREAD_MESSAGE), 400)
//       }

//       if (lastMessageRead) {
//         await updateLastMessageRead(databases, {
//           id: lastMessageRead?.$id,
//           lastMessageReadId: lastMessage.$id,
//         })
//       } else {
//         await createLastConvMessageRead(databases, {
//           userId: currentProfile.$id,
//           conversationId,
//           lastMessageReadId: lastMessage.$id,
//         })
//       }

//       const response: MarkMessageAsReadResponse = successResponse(true)
//       return c.json(response)
//     } catch {
//       return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
//     }
//   },
// )
// .get(
//   "/group/:groupId",
//   zValidator("query", getMessageSchema),
//   sessionMiddleware,
//   validateProfileMiddleware,
//   async (c) => {
//     try {
//       const { groupId } = c.req.param()
//       const { page } = c.req.valid("query")

//       const databases = c.get("databases")
//       const currentProfile = c.get("userProfile")

//       const group = await getGroupById(databases, { id: groupId })
//       if (!group) {
//         return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
//       }

//       const isMember = await validateGroupMember(databases, {
//         userId: currentProfile.$id,
//         groupId,
//       })
//       if (!isMember) {
//         return c.json(createError(ERROR.USER_IS_NOT_MEMBER), 403)
//       }

//       const result = await getMessageByGroupId(databases, {
//         groupId,
//         userId: currentProfile.$id,
//         page,
//       })

//       const userIds: string[] = []
//       result.data.forEach((message) => {
//         if (!userIds.includes(message.userId)) {
//           userIds.push(message.userId)
//         }
//       })

//       const { documents: users } = await getUsers(databases, {
//         queries: [Query.contains("$id", userIds)],
//       })

//       const messageIds = result.data.map((v) => v.$id)
//       const { data: attachments } = await getAttachmentsByMessageIds(
//         databases,
//         {
//           messageIds,
//         },
//       )

//       const messages = result.data.map((message) => {
//         const attachs = attachments
//           .filter((att) => att.messageId === message.$id)
//           .map((a) => mapAttachmentModelToAttachment(a, message.$id))
//         const user = users.find((u) => u.$id === message.userId)!

//         return mapMessageModelToMessage(message, user!, attachs, true)
//       })

//       const response: GetMessagesResponse = successCollectionResponse(
//         messages,
//         result.total,
//       )
//       return c.json(response)
//     } catch {
//       return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
//     }
//   },
// )
// .post(
//   "/group/:groupId/read",
//   sessionMiddleware,
//   validateProfileMiddleware,
//   async (c) => {
//     try {
//       const { groupId } = c.req.param()

//       const databases = c.get("databases")
//       const currentProfile = c.get("userProfile")

//       const group = await getGroupById(databases, { id: groupId })
//       if (!group) {
//         return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
//       }

//       const isMember = await validateGroupMember(databases, {
//         userId: currentProfile.$id,
//         groupId,
//       })
//       if (!isMember) {
//         return c.json(createError(ERROR.USER_IS_NOT_MEMBER), 403)
//       }

//       const lastMessage = await getLastMessageByGroupId(databases, {
//         groupId,
//       })
//       const lastMessageRead = await getLastGroupMessageRead(databases, {
//         groupId,
//         userId: currentProfile.$id,
//       })
//       if (!lastMessage) {
//         return c.json(createError(ERROR.NO_UNREAD_MESSAGE), 400)
//       }

//       if (
//         lastMessage?.$id.localeCompare(
//           lastMessageRead?.$id ?? lastMessage.$id,
//         ) < 0
//       ) {
//         return c.json(createError(ERROR.NO_UNREAD_MESSAGE), 400)
//       }

//       if (lastMessageRead) {
//         await updateLastMessageRead(databases, {
//           id: lastMessageRead?.$id,
//           lastMessageReadId: lastMessage.$id,
//         })
//       } else {
//         await createLastGroupMessageRead(databases, {
//           userId: currentProfile.$id,
//           groupId,
//           lastMessageReadId: lastMessage.$id,
//         })
//       }

//       const response: MarkMessageAsReadResponse = successResponse(true)
//       return c.json(response)
//     } catch {
//       return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
//     }
//   },
// )
// .get(
//   "/channel/:channelId",
//   zValidator("query", getMessageSchema),
//   sessionMiddleware,
//   validateProfileMiddleware,
//   async (c) => {
//     try {
//       const { channelId } = c.req.param()
//       const { page } = c.req.valid("query")

//       const databases = c.get("databases")
//       const currentProfile = c.get("userProfile")

//       const channel = await getChannelById(databases, { id: channelId })
//       if (!channel) {
//         return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
//       }

//       const isSubs = await validateChannelSubs(databases, {
//         userId: currentProfile.$id,
//         channelId,
//       })
//       if (!isSubs) {
//         return c.json(createError(ERROR.USER_IS_NOT_MEMBER), 403)
//       }

//       const result = await getMessageByChannelId(databases, {
//         channelId,
//         userId: currentProfile.$id,
//         page,
//       })

//       const userIds: string[] = []
//       result.data.forEach((message) => {
//         if (!userIds.includes(message.userId)) {
//           userIds.push(message.userId)
//         }
//       })

//       const { documents: users } = await getUsers(databases, {
//         queries: [Query.contains("$id", userIds)],
//       })

//       const messageIds = result.data.map((v) => v.$id)
//       const { data: attachments } = await getAttachmentsByMessageIds(
//         databases,
//         {
//           messageIds,
//         },
//       )

//       const messages = result.data.map((message) => {
//         const attachs = attachments
//           .filter((att) => att.messageId === message.$id)
//           .map((a) => mapAttachmentModelToAttachment(a, message.$id))
//         const user = users.find((u) => u.$id === message.userId)!

//         return mapMessageModelToMessage(message, user!, attachs, true)
//       })

//       const response: GetMessagesResponse = successCollectionResponse(
//         messages,
//         result.total,
//       )
//       return c.json(response)
//     } catch {
//       return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
//     }
//   },
// )
// .post(
//   "/channel/:channelId/read",
//   sessionMiddleware,
//   validateProfileMiddleware,
//   async (c) => {
//     try {
//       const { channelId } = c.req.param()

//       const databases = c.get("databases")
//       const currentProfile = c.get("userProfile")

//       const channel = await getChannelById(databases, { id: channelId })
//       if (!channel) {
//         return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
//       }

//       const isSubs = await validateChannelSubs(databases, {
//         userId: currentProfile.$id,
//         channelId,
//       })
//       if (!isSubs) {
//         return c.json(createError(ERROR.USER_IS_NOT_MEMBER), 403)
//       }

//       const lastMessage = await getLastMessageByChannelId(databases, {
//         channelId,
//       })
//       const lastMessageRead = await getLastChannelMessageRead(databases, {
//         channelId,
//         userId: currentProfile.$id,
//       })
//       if (!lastMessage) {
//         return c.json(createError(ERROR.NO_UNREAD_MESSAGE), 400)
//       }

//       if (
//         lastMessage?.$id.localeCompare(
//           lastMessageRead?.$id ?? lastMessage.$id,
//         ) < 0
//       ) {
//         return c.json(createError(ERROR.NO_UNREAD_MESSAGE), 400)
//       }

//       if (lastMessageRead) {
//         await updateLastMessageRead(databases, {
//           id: lastMessageRead?.$id,
//           lastMessageReadId: lastMessage.$id,
//         })
//       } else {
//         await createLastChannelMessageRead(databases, {
//           userId: currentProfile.$id,
//           channelId,
//           lastMessageReadId: lastMessage.$id,
//         })
//       }

//       const response: MarkMessageAsReadResponse = successResponse(true)
//       return c.json(response)
//     } catch {
//       return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
//     }
//   },
// )
// .put(
//   "/:messageId",
//   sessionMiddleware,
//   validateProfileMiddleware,
//   zValidator("json", updateMessageSchema, zodErrorHandler),
//   async (c) => {
//     try {
//       const { messageId } = c.req.param()
//       const { message: messageText, isEmojiOnly } = c.req.valid("json")

//       const databases = c.get("databases")
//       const currentProfile = c.get("userProfile")

//       const originalMessage = await getMessageById(databases, {
//         id: messageId,
//       })
//       if (!originalMessage) {
//         return c.json(createError(ERROR.MESSAGE_NOT_FOUND), 404)
//       }

//       if (originalMessage.userId !== currentProfile.$id) {
//         return c.json(createError(ERROR.NOT_ALLOWED), 401)
//       }

//       if (originalMessage.status !== "DEFAULT") {
//         return c.json(
//           createError(ERROR.UPDATE_DELETED_MESSAGE_NOT_ALLOWED),
//           403,
//         )
//       }

//       const result = await updateMessage(databases, messageId, {
//         isEmojiOnly: isEmojiOnly ?? originalMessage.isEmojiOnly,
//         message: messageText ?? originalMessage.message,
//       })

//       const attResult = await getAttachmentsByMessageId(databases, {
//         messageId,
//       })
//       const attachments = attResult.data.map((att) =>
//         mapAttachmentModelToAttachment(att, messageId),
//       )

//       const message = mapMessageModelToMessage(
//         result,
//         currentProfile,
//         attachments,
//         true,
//       )

//       const response: UpdateMessageResponse = successResponse(message)
//       return c.json(response)
//     } catch {
//       return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
//     }
//   },
// )
// .delete(
//   "/:messageId/me",
//   sessionMiddleware,
//   validateProfileMiddleware,
//   async (c) => {
//     try {
//       const { messageId } = c.req.param()

//       const databases = c.get("databases")
//       const currentProfile = c.get("userProfile")

//       const originalMessage = await getMessageById(databases, {
//         id: messageId,
//       })
//       if (!originalMessage) {
//         return c.json(createError(ERROR.MESSAGE_NOT_FOUND), 404)
//       }

//       if (originalMessage.userId !== currentProfile.$id) {
//         return c.json(createError(ERROR.NOT_ALLOWED), 401)
//       }

//       if (originalMessage.status !== "DEFAULT") {
//         return c.json(createError(ERROR.MESSAGE_ALREADY_DELETED), 403)
//       }

//       await deleteMessageForMe(databases, messageId)

//       const response: DeleteMessageResponse = successResponse({
//         id: messageId,
//       })
//       return c.json(response)
//     } catch {
//       return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
//     }
//   },
// )
// .delete(
//   "/:messageId/all",
//   sessionMiddleware,
//   validateProfileMiddleware,
//   async (c) => {
//     try {
//       const { messageId } = c.req.param()

//       const databases = c.get("databases")
//       const currentProfile = c.get("userProfile")
//       const storage = c.get("storage")

//       const originalMessage = await getMessageById(databases, {
//         id: messageId,
//       })
//       if (!originalMessage) {
//         return c.json(createError(ERROR.MESSAGE_NOT_FOUND), 404)
//       }

//       if (originalMessage.userId !== currentProfile.$id) {
//         return c.json(createError(ERROR.NOT_ALLOWED), 401)
//       }

//       if (originalMessage.status !== "DEFAULT") {
//         return c.json(createError(ERROR.MESSAGE_ALREADY_DELETED), 403)
//       }

//       await deleteMessageForAll(databases, messageId)

//       const { data: attachments } = await getAttachmentsByMessageId(
//         databases,
//         {
//           messageId,
//         },
//       )
//       await deleteAttachmentsByMessageId(databases, { messageId })
//       await Promise.all(
//         attachments.map((attc) =>
//           deleteFile(storage, { id: destructFileId(attc.url) }),
//         ),
//       )

//       const response: DeleteMessageResponse = successResponse({
//         id: messageId,
//       })
//       return c.json(response)
//     } catch {
//       return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
//     }
//   },
// )
// .delete(
//   "/:messageId/admin",
//   sessionMiddleware,
//   validateProfileMiddleware,
//   async (c) => {
//     try {
//       const { messageId } = c.req.param()

//       const databases = c.get("databases")
//       const currentProfile = c.get("userProfile")
//       const storage = c.get("storage")

//       const originalMessage = await getMessageById(databases, {
//         id: messageId,
//       })
//       if (!originalMessage) {
//         return c.json(createError(ERROR.MESSAGE_NOT_FOUND), 404)
//       }

//       if (originalMessage.conversationId) {
//         return c.json(createError(ERROR.NOT_ALLOWED), 401)
//       }

//       if (originalMessage.groupId) {
//         const isAdmin = validateGroupAdmin(databases, {
//           groupId: originalMessage.groupId,
//           userId: currentProfile.$id,
//         })
//         if (!isAdmin) {
//           return c.json(createError(ERROR.NOT_ALLOWED), 401)
//         }
//       }

//       if (originalMessage.channelId) {
//         const isAdmin = validateChannelAdmin(databases, {
//           channelId: originalMessage.channelId,
//           userId: currentProfile.$id,
//         })
//         if (!isAdmin) {
//           return c.json(createError(ERROR.NOT_ALLOWED), 401)
//         }
//       }

//       if (originalMessage.status !== "DEFAULT") {
//         return c.json(createError(ERROR.MESSAGE_ALREADY_DELETED), 403)
//       }

//       await deleteMessageByAdmin(databases, messageId)

//       const { data: attachments } = await getAttachmentsByMessageId(
//         databases,
//         {
//           messageId,
//         },
//       )
//       await deleteAttachmentsByMessageId(databases, { messageId })
//       await Promise.all(
//         attachments.map((attc) =>
//           deleteFile(storage, { id: destructFileId(attc.url) }),
//         ),
//       )

//       const response: DeleteMessageResponse = successResponse({
//         id: messageId,
//       })
//       return c.json(response)
//     } catch {
//       return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
//     }
//   },
// )

export default messageApp
