import { z } from "zod"

import { imageProfileSchema } from "@/constants"

import { CHANNEL_TYPE } from "./constants"

export const channelSchema = z.object({
  name: z.string().min(1, "Required").min(3),
  description: z.string().min(1, "Required").optional(),
  type: z.nativeEnum(CHANNEL_TYPE),
  image: imageProfileSchema,
})
