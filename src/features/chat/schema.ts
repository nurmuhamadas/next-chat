import { z } from "zod"

import { ERROR } from "@/constants/error"

export const conversationSchema = z.object({
  userId: z.string({ required_error: ERROR.USER_ID_REQUIRED }),
})
