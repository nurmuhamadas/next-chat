"use client"

import Image from "next/image"

import RightPanel from "@/components/right-panel"
import { cn } from "@/lib/utils"

import { useEditedMessageId } from "../hooks/use-edited-message-id"
import { useRepliedMessageId } from "../hooks/use-replied-message-id"
import { useSelectedMessageIds } from "../hooks/use-selected-message-ids"

import ChatInput from "./chat-input"
import ChatRoomHeader from "./chat-room-header"
import ForwardMessageModal from "./forward-message-modal"
import MessageList from "./message-list"
import SelectedMessageMenu from "./selected-messages-menu"

const ChatRoom = () => {
  const { repliedMessageId } = useRepliedMessageId()
  const { editedMessageId } = useEditedMessageId()
  const { isSelectMode } = useSelectedMessageIds()

  const isEmpty = false

  // TODO:
  const repliedMessage = repliedMessageId
    ? {
        id: repliedMessageId,
        name: "User Replied",
        message: "Dolor sit amet",
      }
    : undefined
  // TODO:
  const editedMessage = editedMessageId
    ? {
        id: repliedMessageId,
        name: "User Replied",
        message: "Dolor sit amet",
      }
    : undefined

  return (
    <div className="flex h-screen flex-1 overflow-x-hidden">
      <div className="h-full flex-1 flex-col-center">
        <ChatRoomHeader />

        <div
          className={cn(
            "w-full flex-1 overflow-hidden py-1",
            isEmpty && "flex-col-center",
          )}
        >
          {isEmpty && (
            <div className="m-auto gap-y-6 px-4 flex-col-center">
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

        {isSelectMode ? (
          <SelectedMessageMenu />
        ) : (
          <ChatInput
            repliedMessage={repliedMessage}
            editedMessage={editedMessage}
          />
        )}
      </div>

      <RightPanel />

      <ForwardMessageModal />
    </div>
  )
}

export default ChatRoom
