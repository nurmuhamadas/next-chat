import { useCallback, useEffect, useState } from "react"

import Image from "next/image"

import { isToday, parseISO } from "date-fns"

import useGetChannelMessages from "@/features/messages/hooks/api/use-get-channel-messages"
import useGetGroupMessages from "@/features/messages/hooks/api/use-get-group-messages"
import useGetPrivateMessages from "@/features/messages/hooks/api/use-get-private-messages"
import useGetSetting from "@/features/user/hooks/api/use-get-setting"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"
import { cn, formatChatTime } from "@/lib/utils"

import { useEditedMessageId } from "../hooks/use-edited-message-id"
import { useRepliedMessageId } from "../hooks/use-replied-message-id"

import MessageList, { GroupedMessage, MessageLoading } from "./message-list"

interface ChatRoomMessagesProps {
  showBlank?: boolean
  conversation?: Conversation
  isGroupMember?: boolean
  isPrivateGroup?: boolean
  isChannelSubs?: boolean
  isPrivateChannel?: boolean
  onRepliedMessageChange(message: Message | undefined): void
  onEditMessageChange(message: Message | undefined): void
}
const ChatRoomMessages = ({
  isGroupMember = false,
  isPrivateGroup = true,
  isChannelSubs,
  isPrivateChannel,
  onRepliedMessageChange,
  onEditMessageChange,
}: ChatRoomMessagesProps) => {
  const type = useRoomType()
  const id = useRoomId()

  const { repliedMessageId } = useRepliedMessageId()
  const { editedMessageId } = useEditedMessageId()

  const [messages, setMessages] = useState<Message[]>([])
  const [canLoadMore, setCanLoadMore] = useState(true)
  const [page, setPage] = useState(1)

  const { data: setting } = useGetSetting()

  const { data: privateMessages, isLoading: privateLoading } =
    useGetPrivateMessages({ id: type === "chat" ? id : undefined, page })
  const { data: groupMessages, isLoading: groupLoading } = useGetGroupMessages({
    id: type === "group" ? id : undefined,
    page,
  })
  const { data: channelMessages, isLoading: channelLoading } =
    useGetChannelMessages({ id: type === "channel" ? id : undefined, page })

  const isLoading = privateLoading || groupLoading || channelLoading
  const isEmpty = messages.length === 0

  const groupingMessage = useCallback(
    (messages: Message[]) => {
      let result: GroupedMessage[] = []
      const times: string[] = []

      messages.forEach((message) => {
        const date = parseISO(message.createdAt)

        const time = isToday(date)
          ? "Today"
          : formatChatTime(message.createdAt, setting?.timeFormat ?? "12-HOUR")

        if (!times.includes(time)) {
          times.push(time)
          result.push({ time, messages: [message] })
        } else {
          result = result.map((res) => {
            if (res.time === time) {
              return {
                ...res,
                messages: [...res.messages, message],
              }
            }
            return res
          })
        }
      })

      return result
    },
    [setting?.timeFormat],
  )

  const groupedMessages = groupingMessage(messages)

  useEffect(() => {
    const rawMessage = {
      chat: privateMessages,
      group: groupMessages,
      channel: channelMessages,
    }

    if (!isLoading) {
      setMessages((prev) => [...prev, ...rawMessage[type]])

      if (rawMessage[type].length < 20) {
        setCanLoadMore(false)
      }
    }
  }, [groupingMessage, type, isLoading])

  useEffect(() => {
    if (!isLoading) {
      onRepliedMessageChange(messages?.find((m) => m.id === repliedMessageId))
    }
  }, [repliedMessageId, onRepliedMessageChange, isLoading])

  useEffect(() => {
    if (!isLoading) {
      onEditMessageChange(messages?.find((m) => m.id === editedMessageId))
    }
  }, [editedMessageId, onEditMessageChange, isLoading])

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
      {!isLoading && isEmpty && (
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
      {isLoading && isEmpty && (
        <div className="mx-auto size-full max-w-[700px]">
          <MessageLoading />
        </div>
      )}
      {!isEmpty && (
        <MessageList
          messages={groupedMessages}
          timeFormat={setting?.timeFormat ?? "12-HOUR"}
          canLoadMore={canLoadMore}
          isLoading={isLoading}
          loadMore={() => {
            setPage(page + 1)
          }}
        />
      )}
    </div>
  )
}

export default ChatRoomMessages
