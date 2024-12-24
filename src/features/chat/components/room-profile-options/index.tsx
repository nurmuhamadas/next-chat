import React from "react"

import { useRoomType } from "@/hooks/use-room-type"

import RoomProfileOptionsChannel from "./channel"
import RoomProfileOptionsGroup from "./group"
import RoomProfileOptionsPrivate from "./private"

const RoomProfileOptions = () => {
  const type = useRoomType()

  if (type === "chat") {
    return <RoomProfileOptionsPrivate />
  } else if (type === "group") {
    return <RoomProfileOptionsGroup />
  } else if (type === "channel") {
    return <RoomProfileOptionsChannel />
  } else {
    return null
  }
}

export default RoomProfileOptions
