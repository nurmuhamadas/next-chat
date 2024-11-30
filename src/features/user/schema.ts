import { z } from "zod"

import { imageProfileSchema } from "@/constants"
import { ERROR } from "@/constants/error"

import { GENDER } from "./constants"

export const profileSchema = z.object({
  firstName: z
    .string({ required_error: ERROR.FIRST_NAME_REQUIRED })
    .trim()
    .min(3, ERROR.FIRST_NAME_TOO_SHORT)
    .max(256, ERROR.FIRST_NAME_TOO_LONG),
  lastName: z
    .string()
    .min(3, ERROR.LAST_NAME_TOO_SHORT)
    .max(256, ERROR.LAST_NAME_TOO_LONG)
    .trim()
    .optional(),
  username: z
    .string({ required_error: ERROR.USERNAME_REQUIRED })
    .min(3, ERROR.USERNAME_TOO_SHORT)
    .max(256, ERROR.USERNAME_TOO_LONG)
    .regex(/^[a-zA-Z0-9._-]+$/, ERROR.INVALID_USERNAME_FORMAT),
  gender: z.nativeEnum(GENDER, { message: ERROR.INVALID_GENDER }),
  bio: z.string().max(2048, ERROR.BIO_TOO_LONG).trim().optional(),
  image: imageProfileSchema,
})

export const searchQuerySchema = z.object({
  query: z
    .string()
    .trim()
    .optional()
    .transform((v) => (!v ? undefined : v)),
  limit: z
    .string()
    .trim()
    .optional()
    .transform((v) => (isNaN(Number(v)) ? 20 : Number(v))),
  offset: z
    .string()
    .trim()
    .optional()
    .transform((v) => (isNaN(Number(v)) ? 0 : Number(v))),
})
