import { z } from "zod"

export const imageProfileSchema = z.object({
  name: z.string(),
  size: z.number().max(2 * 1024 * 1024, "Image size must not exceed 2MB"),
  mimetype: z
    .enum(["image/jpeg", "image/png", "image/gif"])
    .or(z.literal("image/webp")),
})

export const ROOM_TYPES: RoomType[] = ["channel", "chat", "group"]
