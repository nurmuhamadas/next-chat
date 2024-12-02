import { z } from "zod"

import { imageProfileSchema } from "@/constants"
import { ERROR } from "@/constants/error"

import { CHANNEL_TYPE } from "./constants"

export const channelSchema = z.object({
  name: z
    .string({ required_error: ERROR.CHANNEL_NAME_REQUIRED })
    .trim()
    .min(3, ERROR.CHANNEL_NAME_TOO_SHORT)
    .max(256, ERROR.CHANNEL_NAME_TOO_LONG),
  description: z
    .string()
    .trim()
    .max(2048, ERROR.CHANNEL_DESC_TOO_LONG)
    .optional(),
  type: z.nativeEnum(CHANNEL_TYPE, {
    required_error: ERROR.CHANNEL_TYPE_REQUIRED,
    invalid_type_error: ERROR.INVALID_CHANNEL_TYPE,
  }),
  image: imageProfileSchema,
})
