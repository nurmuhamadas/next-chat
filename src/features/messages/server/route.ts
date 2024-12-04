import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { Models, Query } from "node-appwrite"

import { ERROR } from "@/constants/error"
import { getChannelById } from "@/features/channel/lib/channel-queries"
import { validateChannelSubs } from "@/features/channel/lib/channel-subscribers-queries"
import { getConversationById } from "@/features/chat/lib/queries"
import { validateGroupMember } from "@/features/group/lib/group-member-queries"
import { getGroupById } from "@/features/group/lib/group-queries"
import { getUserProfileById, getUsers } from "@/features/user/lib/queries"
import { constructFileUrl } from "@/lib/appwrite"
import { sessionMiddleware } from "@/lib/session-middleware"
import { deleteFile, uploadFile } from "@/lib/upload-file"
import {
  createError,
  mergeName,
  successCollectionResponse,
  successResponse,
} from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"
import { zodErrorHandler } from "@/lib/zod-error-handler"

import { MESSAGE_STATUS } from "../constants"
import {
  createAttachment,
  createMessage,
  getAttachmentsByMessageIds,
  getMessageByChannelId,
  getMessageByConversationId,
  getMessageByGroupId,
  getMessageById,
  validateMessage,
} from "../lib/queries"
import {
  getFileType,
  mapAttachmentModelToAttachment,
  mapMessageModelToMessage,
} from "../lib/utils"
import { createMessageSchema } from "../schema"

const messageApp = new Hono()
  .post(
    "/",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("form", createMessageSchema, zodErrorHandler),
    async (c) => {
      try {
        const formValue = c.req.valid("form")

        const databases = c.get("databases")
        const storage = c.get("storage")
        const currentProfile = c.get("userProfile")

        const invalid = await validateMessage(databases, formValue)
        if (invalid) {
          return c.json(createError(invalid.error, invalid.path), invalid.code)
        }

        let parentMessage: MessageAWModel | null = null
        let parentMessageUser: UserAWModel | null = null
        if (formValue.parentMessageId) {
          parentMessage = await getMessageById(databases, {
            id: formValue.parentMessageId,
          })
          if (parentMessage) {
            parentMessageUser = await getUserProfileById(databases, {
              userId: parentMessage.userId,
            })
          }
        }

        let files: Models.File[] = []
        if (formValue.attachments?.length > 0) {
          files = await Promise.all(
            formValue.attachments.map((v) => uploadFile(storage, { file: v })),
          )
        }

        try {
          const result = await createMessage(databases, {
            userId: currentProfile.$id,
            message: formValue.message,
            conversationId: formValue.conversationId,
            groupId: formValue.groupId,
            channelId: formValue.channelId,
            originalMessageId: formValue.originalMessageId,
            parentMessageId: parentMessage?.$id,
            parentMessageName: parentMessageUser
              ? mergeName(
                  parentMessageUser?.firstName,
                  parentMessageUser?.lastName,
                )
              : undefined,
            parentMessageText: parentMessage?.message,
            isEmojiOnly: formValue.isEmojiOnly ?? false,
            status: MESSAGE_STATUS.DEFAULT,
          })

          let attachments: Attachment[] = []
          if (files.length > 0) {
            attachments = files.map((file) => ({
              id: file.$id,
              messageId: result.$id,
              name: file.name,
              size: file.sizeOriginal,
              type: getFileType(file.mimeType),
              url: constructFileUrl(file.$id),
            }))
            await Promise.all(
              files.map((file) =>
                createAttachment(databases, {
                  messageId: result.$id,
                  name: file.name,
                  size: file.sizeOriginal,
                  type: getFileType(file.mimeType),
                  url: constructFileUrl(file.$id),
                }),
              ),
            )
          }

          const message = mapMessageModelToMessage(
            result,
            currentProfile,
            attachments,
            true,
          )

          const response: CreateMessageResponse = successResponse(message)
          return c.json(response)
        } catch {
          if (files.length > 0) {
            await Promise.all(
              files.map((file) => deleteFile(storage, { id: file.$id })),
            )
          }
          return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
        }
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get(
    "/private/:conversationId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { conversationId } = c.req.param()

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const conversation = await getConversationById(databases, {
          conversationId,
        })
        if (!conversation) {
          return c.json(createError(ERROR.CONVERSATION_NOT_FOUND), 404)
        }

        if (
          conversation.userId1 !== currentProfile.$id &&
          conversation.userId2 !== currentProfile.$id
        ) {
          return c.json(createError(ERROR.NOT_ALLOWED), 403)
        }

        const result = await getMessageByConversationId(databases, {
          conversationId,
          userId: currentProfile.$id,
        })
        const userPairId =
          conversation.userId1 === currentProfile.$id
            ? conversation.userId2
            : conversation.userId1
        const userPair = await getUserProfileById(databases, {
          userId: userPairId,
        })

        const messageIds = result.data.map((v) => v.$id)
        const { data: attachments } = await getAttachmentsByMessageIds(
          databases,
          {
            messageIds,
          },
        )

        const messages = result.data.map((message) => {
          const attachs = attachments
            .filter((att) => att.messageId === message.$id)
            .map((a) => mapAttachmentModelToAttachment(a, message.$id))
          const user =
            message.userId === currentProfile.$id ? currentProfile : userPair

          return mapMessageModelToMessage(message, user!, attachs, true)
        })

        const response: GetMessagesResponse = successCollectionResponse(
          messages,
          result.total,
        )
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get(
    "/group/:groupId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { groupId } = c.req.param()

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const group = await getGroupById(databases, { id: groupId })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const isMember = await validateGroupMember(databases, {
          userId: currentProfile.$id,
          groupId,
        })
        if (!isMember) {
          return c.json(createError(ERROR.USER_IS_NOT_MEMBER), 403)
        }

        const result = await getMessageByGroupId(databases, {
          groupId,
          userId: currentProfile.$id,
        })

        const userIds: string[] = []
        result.data.forEach((message) => {
          if (!userIds.includes(message.userId)) {
            userIds.push(message.userId)
          }
        })

        const { documents: users } = await getUsers(databases, {
          queries: [Query.contains("$id", userIds)],
        })

        const messageIds = result.data.map((v) => v.$id)
        const { data: attachments } = await getAttachmentsByMessageIds(
          databases,
          {
            messageIds,
          },
        )

        const messages = result.data.map((message) => {
          const attachs = attachments
            .filter((att) => att.messageId === message.$id)
            .map((a) => mapAttachmentModelToAttachment(a, message.$id))
          const user = users.find((u) => u.$id === message.userId)!

          return mapMessageModelToMessage(message, user!, attachs, true)
        })

        const response: GetMessagesResponse = successCollectionResponse(
          messages,
          result.total,
        )
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get(
    "/channel/:channelId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { channelId } = c.req.param()

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const channel = await getChannelById(databases, { id: channelId })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const isSubs = await validateChannelSubs(databases, {
          userId: currentProfile.$id,
          channelId,
        })
        if (!isSubs) {
          return c.json(createError(ERROR.USER_IS_NOT_MEMBER), 403)
        }

        const result = await getMessageByChannelId(databases, {
          channelId,
          userId: currentProfile.$id,
        })

        const userIds: string[] = []
        result.data.forEach((message) => {
          if (!userIds.includes(message.userId)) {
            userIds.push(message.userId)
          }
        })

        const { documents: users } = await getUsers(databases, {
          queries: [Query.contains("$id", userIds)],
        })

        const messageIds = result.data.map((v) => v.$id)
        const { data: attachments } = await getAttachmentsByMessageIds(
          databases,
          {
            messageIds,
          },
        )

        const messages = result.data.map((message) => {
          const attachs = attachments
            .filter((att) => att.messageId === message.$id)
            .map((a) => mapAttachmentModelToAttachment(a, message.$id))
          const user = users.find((u) => u.$id === message.userId)!

          return mapMessageModelToMessage(message, user!, attachs, true)
        })

        const response: GetMessagesResponse = successCollectionResponse(
          messages,
          result.total,
        )
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )

export default messageApp
