import { z } from "zod"

import { imageProfileSchema } from "@/lib/constants"

import { GENDER } from "./constants"

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
  image: imageProfileSchema.optional(),
})
