import { z } from "zod"

import { ERROR } from "@/constants/error"

import { LANGUAGE, NOTIFICATION, TIME_FORMAT } from "../user/constants"

export const settingSchema = z.object({
  timeFormat: z
    .nativeEnum(TIME_FORMAT, {
      invalid_type_error: ERROR.INVALID_TIME_FORMAT,
    })
    .optional(),
  language: z
    .nativeEnum(LANGUAGE, {
      invalid_type_error: ERROR.INVALID_LANGUAGE,
    })
    .optional(),
  notifications: z
    .nativeEnum(NOTIFICATION, {
      invalid_type_error: ERROR.INVALID_NOTIFICATION_TYPE,
    })
    .array()
    .optional(),
  enable2FA: z.boolean({ invalid_type_error: ERROR.INVALID_TYPE }).optional(),
  showLastSeen: z
    .boolean({ invalid_type_error: ERROR.INVALID_TYPE })
    .optional(),
  allowToAddToGroup: z
    .boolean({ invalid_type_error: ERROR.INVALID_TYPE })
    .optional(),
})
