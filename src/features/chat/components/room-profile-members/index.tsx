import { useRoomType } from "@/hooks/use-room-type"

import RoomProfileMembersChannel from "./channel"
import RoomProfileMembersGroup from "./group"

const RoomProfileMembers = () => {
  const roomType = useRoomType()

  if (roomType === "chat") {
    return null
  } else if (roomType === "group") {
    return <RoomProfileMembersGroup />
  } else if (roomType === "channel") {
    return <RoomProfileMembersChannel />
  }

  return null
}

export default RoomProfileMembers
