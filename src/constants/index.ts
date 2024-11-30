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

export const ROOM_TYPES: RoomType[] = ["channel", "chat", "group"]
