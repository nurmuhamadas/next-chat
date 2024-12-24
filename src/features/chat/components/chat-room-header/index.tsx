"use client"

import { useRoomType } from "@/hooks/use-room-type"

import ChatRoomHeaderChannel from "./channel"
import ChatRoomHeaderGroup from "./group"
import ChatRoomHeaderPrivate from "./private"

const ChatRoomHeader = () => {
  const type = useRoomType()

  if (type === "chat") {
    return <ChatRoomHeaderPrivate />
  } else if (type === "group") {
    return <ChatRoomHeaderGroup />
  } else if (type === "channel") {
    return <ChatRoomHeaderChannel />
  } else {
    return null
  }
}

export default ChatRoomHeader
