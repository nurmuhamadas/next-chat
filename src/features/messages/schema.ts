import { z } from "zod"

import { attachmentSchema } from "@/constants"
import { ERROR } from "@/constants/error"

export const createMessageSchema = z
  .object({
    message: z
      .string({
        invalid_type_error: ERROR.INVALID_TYPE,
      })
      .max(1048576, ERROR.MESSAGE_TOO_LONG)
      .optional(),
    parentMessageId: z
      .string({ invalid_type_error: ERROR.INVALID_TYPE })
      .optional(),
    conversationId: z
      .string({ invalid_type_error: ERROR.INVALID_TYPE })
      .optional(),
    groupId: z.string({ invalid_type_error: ERROR.INVALID_TYPE }).optional(),
    channelId: z.string({ invalid_type_error: ERROR.INVALID_TYPE }).optional(),
    originalMessageId: z
      .string({ invalid_type_error: ERROR.INVALID_TYPE })
      .optional(),
    isEmojiOnly: z
      .string({ invalid_type_error: ERROR.INVALID_TYPE })
      .transform((text) => (text?.toLowerCase() === "true" ? true : false))
      .optional(),
    attachments: attachmentSchema.array().optional().default([]),
  })
  .refine((value) => value.message || value.attachments?.length > 0, {
    message: ERROR.SHOULD_HAVE_MESSAGE_OR_ATTACHMENT,
    path: ["message", "attachment"],
  })
  .refine(
    (value) => {
      return value.conversationId || value.groupId || value.channelId
    },
    {
      message: ERROR.ROOM_ID_REQUIRED,
      path: ["conversationId", "groupId", "channelId"],
    },
  )
  .refine(
    (value) => {
      if (value.conversationId && value.groupId && value.channelId) return false
      if (value.conversationId && (value.groupId || value.channelId))
        return false
      if (value.groupId && (value.conversationId || value.channelId))
        return false
      if (value.channelId && (value.conversationId || value.groupId))
        return false

      return true
    },
    {
      message: ERROR.ROOM_ID_DUPLICATED,
      path: ["conversationId", "groupId", "channelId"],
    },
  )

export const updateMessageSchema = z.object({
  message: z
    .string({
      required_error: ERROR.MESSAGE_REQUIRED,
      invalid_type_error: ERROR.INVALID_TYPE,
    })
    .max(1048576, ERROR.MESSAGE_TOO_LONG),
  isEmojiOnly: z
    .string({ invalid_type_error: ERROR.INVALID_TYPE })
    .transform((text) => (text?.toLowerCase() === "true" ? true : false))
    .optional(),
})
