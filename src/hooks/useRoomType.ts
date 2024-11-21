import { useParams } from "next/navigation"

import { ROOM_TYPES } from "@/lib/constants"

export const useRoomType = (): RoomType => {
  const params = useParams()

  const roomType = params.roomType as string

  if (ROOM_TYPES.includes(roomType as RoomType)) return roomType as RoomType

  return "chat"
}
