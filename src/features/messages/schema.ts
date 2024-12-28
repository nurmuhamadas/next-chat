import { RoomType } from "@prisma/client"
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
    receiverId: z.string({ invalid_type_error: ERROR.INVALID_TYPE }),
    roomType: z.nativeEnum(RoomType),
    parentMessageId: z
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

export const getMessageParamSchema = z.object({
  roomType: z
    .enum(["private", "group", "channel"], {
      invalid_type_error: ERROR.INVALID_ROOM_TYPE,
    })
    .transform((v) => v.toUpperCase() as RoomType),
  receiverId: z.string().min(1, ERROR.REQUIRED),
})

export const forwardMessageSchema = z.object({
  roomType: z.nativeEnum(RoomType),
  receiverId: z.string().min(1, ERROR.REQUIRED),
})
