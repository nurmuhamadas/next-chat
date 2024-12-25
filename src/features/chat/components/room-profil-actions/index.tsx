import React from "react"

import { useRoomType } from "@/hooks/use-room-type"

import RoomProfilActionsChannel from "./channel"
import RoomProfilActionsGroup from "./group"
import RoomProfilActionsPrivate from "./private"

const RoomProfilActions = () => {
  const type = useRoomType()

  if (type === "chat") {
    return <RoomProfilActionsPrivate />
  } else if (type === "group") {
    return <RoomProfilActionsGroup />
  } else if (type === "channel") {
    return <RoomProfilActionsChannel />
  } else {
    return null
  }
}

export default RoomProfilActions
