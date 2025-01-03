"use client"

import { useEffect, useState } from "react"

import { useQueryClient } from "@tanstack/react-query"

import Loading from "@/components/loader"
import RightPanel from "@/components/right-panel"
import useGetChannelById from "@/features/channel/hooks/api/use-get-channel-by-id"
import useGetGroupById from "@/features/group/hooks/api/use-get-group-by-id"
import useReadMessage from "@/features/messages/hooks/api/use-read-message"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"
import { roomTypeToRoomTypeModelLower } from "@/lib/utils"

import useGetRoom from "../hooks/api/use-get-room"
import { useSelectedMessageIds } from "../hooks/use-selected-message-ids"

import ChatInput from "./chat-input"
import ChatRoomHeader from "./chat-room-header"
import ChatRoomMessages from "./chat-room-messages"
import DeleteMessageModal from "./delete-message-modal"
import ForwardMessageModal from "./forward-message-modal"
import SelectedMessageMenu from "./selected-messages-menu"

const ChatRoom = () => {
  const queryClient = useQueryClient()

  const type = useRoomType()
  const id = useRoomId()

  const groupId = type === "group" ? id : undefined
  const channelId = type === "channel" ? id : undefined

  const [repliedMessage, setRepliedMessage] = useState<Message | undefined>()
  const [editedMessage, setEditedMessage] = useState<Message | undefined>()
  const [deletedMessage, setDeletedMessage] = useState<Message | undefined>()

  const { isSelectMode } = useSelectedMessageIds()

  const { mutate: readMessage } = useReadMessage()

  const { data: room, isLoading: loadingRoom } = useGetRoom({ id })
  const { data: group, isLoading: loadingGroup } = useGetGroupById({
    id: groupId,
  })
  const { data: channel, isLoading: loadingChannel } = useGetChannelById({
    id: channelId,
  })

  const isLoading = loadingGroup || loadingChannel || loadingRoom
  const isGroupMember = group?.isMember ?? false
  const isGroupAdmin = group?.isAdmin ?? false
  const isChannelSubs = channel?.isSubscribers ?? false
  const isChannelAdmin = channel?.isAdmin ?? false

  const hideInput =
    (type === "group" && !isGroupMember) ||
    (type === "channel" && !isChannelAdmin)
  const hideMessage =
    (type === "group" && !isGroupMember) ||
    (type === "channel" && !isChannelSubs)

  useEffect(() => {
    if ((room?.totalUnreadMessages ?? 0) > 0) {
      readMessage(
        {
          param: {
            receiverId: id,
            roomType: roomTypeToRoomTypeModelLower(type),
          },
        },
        {
          onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["rooms"] })
          },
        },
      )
    }
  }, [id, queryClient, readMessage, room?.totalUnreadMessages, type])

  return (
    <div className="flex h-screen flex-1 overflow-x-hidden">
      <div className="h-full flex-1 flex-col-center">
        <ChatRoomHeader />

        {isLoading ? (
          <Loading />
        ) : (
          <>
            <ChatRoomMessages
              hideMessage={hideMessage}
              group={group}
              channel={channel}
              onRepliedMessageChange={setRepliedMessage}
              onEditMessageChange={setEditedMessage}
              onDeletedMessageChange={setDeletedMessage}
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

      <DeleteMessageModal
        isAdmin={isGroupAdmin || isChannelAdmin}
        message={deletedMessage}
      />
    </div>
  )
}

export default ChatRoom
