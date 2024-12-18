import { z } from "zod"

import { imageProfileSchema } from "@/constants"
import { ERROR } from "@/constants/error"

import { GROUP_TYPE } from "./constants"

export const groupSchema = z.object({
  name: z
    .string({ required_error: ERROR.GROUP_NAME_REQUIRED })
    .trim()
    .min(1, ERROR.GROUP_NAME_REQUIRED)
    .min(3, ERROR.GROUP_NAME_TOO_SHORT)
    .max(256, ERROR.GROUP_NAME_TOO_LONG),
  description: z
    .string()
    .trim()
    .max(2048, ERROR.GROUP_DESC_TOO_LONG)
    .optional(),
  type: z.nativeEnum(GROUP_TYPE, {
    required_error: ERROR.GROUP_TYPE_REQUIRED,
    invalid_type_error: ERROR.INVALID_GROUP_TYPE,
  }),
  memberIds: z
    .string({ description: "string of memberId separated with comma" })
    .optional(),
  image: imageProfileSchema,
})

export const joinGroupSchema = z.object({
  code: z
    .string({
      required_error: ERROR.JOIN_CODE_REQUIRED,
      invalid_type_error: ERROR.INVALID_JOIN_CODE,
    })
    .length(10, ERROR.INVALID_JOIN_CODE)
    .optional(),
})

export const updateGroupOptionSchema = z.object({
  notification: z.boolean({
    required_error: ERROR.NOTIFICATION_REQUIRED,
    invalid_type_error: ERROR.INVALID_NOTIFICATION_TYPE,
  }),
})
