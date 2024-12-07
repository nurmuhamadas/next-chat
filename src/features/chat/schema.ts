import { z } from "zod"

import { ERROR } from "@/constants/error"

export const conversationSchema = z.object({
  userId: z.string({ required_error: ERROR.USER_ID_REQUIRED }),
})

export const updateConversationSchema = z
  .object({
    notification: z.boolean({ invalid_type_error: ERROR.INVALID_TYPE }),
  })
  .partial()
