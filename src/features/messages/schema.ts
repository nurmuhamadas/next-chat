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
      .optional()
      .transform((v) => (v === "undefined" ? undefined : v)),
    parentMessageId: z
      .string({ invalid_type_error: ERROR.INVALID_TYPE })
      .optional()
      .transform((v) => (v === "undefined" ? undefined : v)),
    userId: z
      .string({ invalid_type_error: ERROR.INVALID_TYPE })
      .optional()
      .transform((v) => (v === "undefined" ? undefined : v)),
    groupId: z
      .string({ invalid_type_error: ERROR.INVALID_TYPE })
      .optional()
      .transform((v) => (v === "undefined" ? undefined : v)),
    channelId: z
      .string({ invalid_type_error: ERROR.INVALID_TYPE })
      .optional()
      .transform((v) => (v === "undefined" ? undefined : v)),
    originalMessageId: z
      .string({ invalid_type_error: ERROR.INVALID_TYPE })
      .optional()
      .transform((v) => (v === "undefined" ? undefined : v)),
    isEmojiOnly: z
      .string({ invalid_type_error: ERROR.INVALID_TYPE })
      .transform((text) => (text?.toLowerCase() === "true" ? true : false))
      .optional(),
    attachments: z.union([
      attachmentSchema,
      z.array(attachmentSchema).optional().default([]),
    ]),
  })
  .refine((value) => value.message || !!value.attachments, {
    message: ERROR.SHOULD_HAVE_MESSAGE_OR_ATTACHMENT,
    path: ["message", "attachment"],
  })
  .refine(
    (value) => {
      return value.userId || value.groupId || value.channelId
    },
    {
      message: ERROR.ROOM_ID_REQUIRED,
      path: ["userId", "groupId", "channelId"],
    },
  )
  .refine(
    (value) => {
      if (value.userId && value.groupId && value.channelId) return false
      if (value.userId && (value.groupId || value.channelId)) return false
      if (value.groupId && (value.userId || value.channelId)) return false
      if (value.channelId && (value.userId || value.groupId)) return false

      return true
    },
    {
      message: ERROR.ROOM_ID_DUPLICATED,
      path: ["userId", "groupId", "channelId"],
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

export const getMessageSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => {
      const num = Number(v)
      if (isNaN(num)) {
        return 1
      }

      return num
    }),
})
