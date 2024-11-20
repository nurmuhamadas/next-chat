import ChatRoom from "@/features/chat/components/chat-room"

interface ChatRoomPageProps {
  params: Promise<{ roomType: RoomType; roomId: string }>
}

const ChatRoomPage = ({}: ChatRoomPageProps) => {
  return <ChatRoom />
}

export default ChatRoomPage
