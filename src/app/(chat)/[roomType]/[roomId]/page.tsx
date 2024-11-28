import { redirect } from "next/navigation"

import ChatRoom from "@/features/chat/components/chat-room"
import { ROOM_TYPES } from "@/constants"

interface ChatRoomPageProps {
  params: Promise<{ roomType: RoomType; roomId: string }>
}

const ChatRoomPage = async ({ params }: ChatRoomPageProps) => {
  const { roomType, roomId } = await params

  if (!ROOM_TYPES.includes(roomType)) redirect(`/chat/${roomId}`)

  return <ChatRoom />
}

export default ChatRoomPage
