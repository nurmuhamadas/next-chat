"use client"

import Loading from "@/components/loader"
import RightPanel from "@/components/right-panel"
import useGetChannelById from "@/features/channel/hooks/api/use-get-channel-by-id"
import useGetIsChannelAdmin from "@/features/channel/hooks/api/use-get-is-channel-admin"
import useGetIsChanelSubs from "@/features/channel/hooks/api/use-get-is-channel-subs"
import useGetGroupById from "@/features/group/hooks/api/use-get-group-by-id"
import useGetIsGroupMember from "@/features/group/hooks/api/use-get-is-group-member"
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

  const { data: conversation, isLoading: loadingConversation } =
    useGetConversationByUserId({ id: type === "chat" ? id : undefined })

  const { data: isGroupMember, isLoading: loadingGMember } =
    useGetIsGroupMember({ id: type === "group" ? id : undefined })
  const { data: group, isLoading: loadingGroup } = useGetGroupById({
    id: type === "group" ? id : undefined,
  })
  const { data: isChannelSubs, isLoading: loadingChannelSubs } =
    useGetIsChanelSubs({ id: type === "channel" ? id : undefined })
  const { data: isChannelAdmin, isLoading: loadingChannelAdmin } =
    useGetIsChannelAdmin({ id: type === "channel" ? id : undefined })
  const { data: channel, isLoading: loadingChannel } = useGetChannelById({
    id: type === "channel" ? id : undefined,
  })

  const isLoading =
    loadingConversation ||
    loadingGMember ||
    loadingGroup ||
    loadingChannel ||
    loadingChannelSubs ||
    loadingChannelAdmin
  const isPrivateGroup = group ? group?.type === "PRIVATE" : true
  const isPrivateChannel = channel ? channel?.type === "PRIVATE" : true

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

  const hideInput =
    (type === "group" && !isGroupMember) ||
    (type === "channel" && !isChannelAdmin)

  return (
    <div className="flex h-screen flex-1 overflow-x-hidden">
      <div className="h-full flex-1 flex-col-center">
        <ChatRoomHeader
          isGroupMember={isGroupMember}
          isPrivateGroup={isPrivateGroup}
          isChannelSubs={isChannelSubs}
          isPrivateChannel={isPrivateChannel}
        />

        {isLoading ? (
          <Loading />
        ) : (
          <>
            <ChatRoomMessages
              conversation={conversation ?? undefined}
              isGroupMember={isGroupMember}
              isPrivateGroup={isPrivateGroup}
              isChannelSubs={isChannelSubs}
              isPrivateChannel={isPrivateChannel}
            />

            {!hideInput && (
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
          </>
        )}
      </div>

      <RightPanel />

      <ForwardMessageModal />
    </div>
  )
}

export default ChatRoom
