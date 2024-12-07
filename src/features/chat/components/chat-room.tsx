"use client"

import RightPanel from "@/components/right-panel"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"

import useGetConversationByUserId from "../hooks/api/use-get-conversation-by-user-id"
import { useEditedMessageId } from "../hooks/use-edited-message-id"
import { useRepliedMessageId } from "../hooks/use-replied-message-id"
import { useSelectedMessageIds } from "../hooks/use-selected-message-ids"

import ChatInput from "./chat-input"
import ChatRoomHeader from "./chat-room-header"
import ChatRoomMessages from "./chat-room-messages"
import ForwardMessageModal from "./forward-message-modal"
import SelectedMessageMenu from "./selected-messages-menu"

const ChatRoom = () => {
  const type = useRoomType()
  const id = useRoomId()

  const { repliedMessageId } = useRepliedMessageId()
  const { editedMessageId } = useEditedMessageId()
  const { isSelectMode } = useSelectedMessageIds()

  const { data: conversation } = useGetConversationByUserId({
    id: type === "chat" ? id : undefined,
  })

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

  const inputShown = !(type == "chat" && !conversation)

  return (
    <div className="flex h-screen flex-1 overflow-x-hidden">
      <div className="h-full flex-1 flex-col-center">
        <ChatRoomHeader />

        <ChatRoomMessages />

        {inputShown && (
          <>
            {isSelectMode ? (
              <SelectedMessageMenu />
            ) : (
              <ChatInput
                repliedMessage={repliedMessage}
                editedMessage={editedMessage}
              />
            )}
          </>
        )}
      </div>

      <RightPanel />

      <ForwardMessageModal />
    </div>
  )
}

export default ChatRoom
