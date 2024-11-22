import { z } from "zod"

export const imageProfileSchema = z.object({
  name: z.string(),
  size: z.number().max(2 * 1024 * 1024, "Image size must not exceed 2MB"),
  mimetype: z
    .enum(["image/jpeg", "image/png", "image/gif"])
    .or(z.literal("image/webp")),
})

export const ROOM_TYPES: RoomType[] = ["channel", "chat", "group"]

export const CONFIRM_DIALOG_ACTIONS: ChatRoomMenuAction[] = [
  "mute-chat",
  "block-user",
  "delete-chat",
  "mute-group",
  "leave-group",
  "delete-and-exit-group",
  "mute-channel",
  "leave-channel",
  "delete-and-exit-channel",
]
