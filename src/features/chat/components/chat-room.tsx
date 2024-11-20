import Image from "next/image"

import ChatInput from "./chat-input"
import ChatRoomHeader from "./chat-room-header"

const ChatRoom = () => {
  const isEmpty = true

  return (
    <div className="h-screen flex-1 flex-col-center">
      <ChatRoomHeader />

      <div className="w-full flex-1 justify-end overflow-y-auto bg-red-200 flex-col-center">
        {isEmpty && (
          <div className="m-auto gap-y-6 flex-col-center">
            <Image
              src="/images/no-message.svg"
              alt="no conversation"
              width={200}
              height={169}
              className="h-auto w-28 lg:w-32"
            />
            <div className="gap-y-2 flex-col-center">
              <h4 className="h4">No Messages</h4>
              <p className="body-2">Send message and start conversation</p>
            </div>
          </div>
        )}

        <ChatInput />
      </div>
    </div>
  )
}

export default ChatRoom
