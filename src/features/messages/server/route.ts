import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { Models } from "node-appwrite"

import { ERROR } from "@/constants/error"
import { getUserProfileById } from "@/features/user/lib/queries"
import { constructFileUrl } from "@/lib/appwrite"
import { sessionMiddleware } from "@/lib/session-middleware"
import { deleteFile, uploadFile } from "@/lib/upload-file"
import { createError, mergeName, successResponse } from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"
import { zodErrorHandler } from "@/lib/zod-error-handler"

import { MESSAGE_STATUS } from "../constants"
import {
  createAttachment,
  createMessage,
  getMessageById,
  validateMessage,
} from "../lib/queries"
import { getFileType, mapMessageModelToMessage } from "../lib/utils"
import { createMessageSchema } from "../schema"

const messageApp = new Hono()
  .get()
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
        } catch (error) {
          console.log(error)
          if (files.length > 0) {
            await Promise.all(
              files.map((file) => deleteFile(storage, { id: file.$id })),
            )
          }
          return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
        }
      } catch (error) {
        console.log(error)
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )

export default messageApp
