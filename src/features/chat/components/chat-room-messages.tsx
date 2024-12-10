import Image from "next/image"

import useGetChannelMessages from "@/features/messages/hooks/api/use-get-channel-messages"
import useGetGroupMessages from "@/features/messages/hooks/api/use-get-group-messages"
import useGetPrivateMessages from "@/features/messages/hooks/api/use-get-private-messages"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"
import { cn } from "@/lib/utils"

import MessageList from "./message-list"

interface ChatRoomMessagesProps {
  showBlank?: boolean
  conversation?: Conversation
  isGroupMember?: boolean
  isPrivateGroup?: boolean
  isChannelSubs?: boolean
  isPrivateChannel?: boolean
}
const ChatRoomMessages = ({
  isGroupMember = false,
  isPrivateGroup = true,
  isChannelSubs,
  isPrivateChannel,
}: ChatRoomMessagesProps) => {
  const type = useRoomType()
  const id = useRoomId()

  const { data: privateMessages, total: totalPrivateMessage } =
    useGetPrivateMessages({ id: type === "chat" ? id : undefined })
  const { data: groupMessages, total: totalGroupMessage } = useGetGroupMessages(
    { id: type === "group" ? id : undefined },
  )
  const { data: channelMessages, total: totalChannelMessage } =
    useGetChannelMessages({ id: type === "channel" ? id : undefined })

  const messages = {
    chat: privateMessages,
    group: groupMessages,
    channel: channelMessages,
  }

  const isEmpty =
    totalPrivateMessage === 0 &&
    totalGroupMessage === 0 &&
    totalChannelMessage === 0

  const showBlank =
    (type === "group" && isPrivateGroup && !isGroupMember) ||
    (type === "channel" && isPrivateChannel && !isChannelSubs)

  if (showBlank) {
    return <div className="w-full flex-1"></div>
  }

  return (
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
          </div>
        </div>
      )}

      {!isEmpty && <MessageList messages={messages[type]} />}
    </div>
  )
}

export default ChatRoomMessages
