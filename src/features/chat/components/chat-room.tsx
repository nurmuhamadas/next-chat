import Image from "next/image"

import RightPanel from "@/components/right-panel"

import ChatInput from "./chat-input"
import ChatRoomHeader from "./chat-room-header"
import MessageList from "./message-list"

const ChatRoom = () => {
  const isEmpty = false

  return (
    <div className="flex h-screen flex-1 overflow-x-hidden">
      <div className="h-full flex-1 flex-col-center">
        <ChatRoomHeader />

        <div className="h-[calc(100vh-128px)] w-full justify-end flex-col-center">
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

          {!isEmpty && <MessageList />}
        </div>

        <ChatInput />
      </div>

      <RightPanel />
    </div>
  )
}

export default ChatRoom
