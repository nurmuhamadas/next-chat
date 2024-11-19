import { z } from "zod"

import { GENDER } from "./constants"

const imageFileSchema = z.object({
  name: z.string(),
  size: z.number().max(2 * 1024 * 1024, "Image size must not exceed 2MB"),
  mimetype: z
    .enum(["image/jpeg", "image/png", "image/gif"])
    .or(z.literal("image/webp")),
})

export const profileSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required").optional(),
  username: z
    .string()
    .min(1, "Required")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Username can only contain letters, numbers, and underscores.",
    ),
  gender: z.nativeEnum(GENDER),
  bio: z.string().max(2048).optional(),
  image: imageFileSchema.optional(),
})
