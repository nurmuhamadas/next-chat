import { z } from "zod"

import { imageProfileSchema } from "@/constants"
import { ERROR } from "@/constants/error"

import { GENDER } from "./constants"

export const profileSchema = z.object({
  firstName: z
    .string({ message: ERROR.FIRST_NAME_REQUIRED })
    .min(1, ERROR.FIRST_NAME_REQUIRED)
    .max(256, ERROR.FIRST_NAME_TOO_LONG),
  lastName: z.string().max(256, ERROR.LAST_NAME_TOO_LONG).optional(),
  username: z
    .string({ message: ERROR.USERNAME_REQUIRED })
    .min(1, ERROR.USERNAME_REQUIRED)
    .max(256, ERROR.USERNAME_TOO_LONG)
    .regex(/^[a-zA-Z0-9._-]+$/, ERROR.INVALID_USERNAME_FORMAT),
  gender: z.nativeEnum(GENDER, { message: ERROR.INVALID_GENDER }),
  bio: z.string().max(2048, ERROR.BIO_TOO_LONG).optional(),
  image: imageProfileSchema,
})
