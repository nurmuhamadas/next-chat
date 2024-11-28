import { z } from "zod"

import { imageProfileSchema } from "@/constants"

import { GROUP_TYPE } from "./constants"

export const groupSchema = z.object({
  name: z.string().min(1, "Required").min(3),
  description: z.string().optional(),
  type: z.nativeEnum(GROUP_TYPE),
  members: z.array(z.string()),
  image: imageProfileSchema,
})
