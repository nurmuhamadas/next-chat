import { z } from "zod"

import { imageProfileSchema } from "@/lib/constants"

import { GROUP_TYPE } from "./constants"

export const groupSchema = z.object({
  name: z.string().min(1, "Required").min(3),
  description: z.string().min(1, "Required").optional(),
  type: z.nativeEnum(GROUP_TYPE),
  image: imageProfileSchema,
})