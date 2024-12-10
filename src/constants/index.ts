import { z } from "zod"

import { ERROR } from "./error"

export const imageProfileSchema = z
  .any()
  .optional()
  .refine(
    (file) => {
      if (!file) return true

      return ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
        file.type,
      )
    },
    { message: ERROR.INVALID_IMAGE_TYPE },
  )
  .refine(
    (file) => {
      if (!file) return true

      return file.size <= 2 * 1024 * 1024
    },
    {
      message: ERROR.IMAGE_TOO_LARGE,
    },
  )

export const attachmentSchema = z
  .any()
  .optional()
  .refine(
    (file) => {
      if (!file) return true

      return [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
        "image/gif",
        "audio/mpeg",
        "audio/wav",
        "audio/mp3",
        "audio/webm",
        "video/mp4",
        "application/pdf",
      ].includes(file.type)
    },
    { message: ERROR.INVALID_TYPE },
  )
  .refine(
    (file) => {
      if (!file) return true

      return file.size <= 10 * 1024 * 1024
    },
    {
      message: ERROR.ATTACHMENT_TOO_LARGE,
    },
  )

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

export const ROOM_TYPES: RoomType[] = ["channel", "chat", "group"]
