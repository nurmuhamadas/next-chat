import { useCallback, useEffect, useState } from "react"

import Image from "next/image"

import { isToday, parseISO } from "date-fns"

import { Skeleton } from "@/components/ui/skeleton"
import useGetChannelMessages from "@/features/messages/hooks/api/use-get-channel-messages"
import useGetGroupMessages from "@/features/messages/hooks/api/use-get-group-messages"
import useGetPrivateMessages from "@/features/messages/hooks/api/use-get-private-messages"
import useGetSetting from "@/features/user/hooks/api/use-get-setting"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"
import { cn, formatChatTime } from "@/lib/utils"

import MessageList, { GroupedMessage } from "./message-list"

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

  const [messages, setMessages] = useState<GroupedMessage[]>([])

  const { data: setting } = useGetSetting()

  const { data: privateMessages, isLoading: privateLoading } =
    useGetPrivateMessages({
      id: type === "chat" ? id : undefined,
    })
  const { data: groupMessages, isLoading: groupLoading } = useGetGroupMessages({
    id: type === "group" ? id : undefined,
  })
  const { data: channelMessages, isLoading: channelLoading } =
    useGetChannelMessages({
      id: type === "channel" ? id : undefined,
    })

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

  useEffect(() => {
    const rawMessage = {
      chat: privateMessages,
      group: groupMessages,
      channel: channelMessages,
    }

    if (!isLoading) {
      setMessages(groupingMessage(rawMessage[type]))
    }
  }, [groupingMessage, type, isLoading])

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
      {isLoading && <MessageLoading />}
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
      {!isLoading && !isEmpty && (
        <MessageList
          messages={messages}
          timeFormat={setting?.timeFormat ?? "12-HOUR"}
        />
      )}
    </div>
  )
}

const MessageLoading = () => {
  return (
    <div className="mx-auto flex size-full max-w-[700px] flex-1 flex-col justify-end gap-y-2">
      <Skeleton className="ml-auto h-10 w-[300px]" />
      <Skeleton className="ml-auto h-8 w-[160px]" />
      <Skeleton className="h-10 w-[300px]" />
      <Skeleton className="h-8 w-[160px]" />
      <Skeleton className="ml-auto h-10 w-[300px]" />
      <Skeleton className="ml-auto h-8 w-[160px]" />
      <Skeleton className="h-10 w-[300px]" />
      <Skeleton className="h-8 w-[160px]" />
    </div>
  )
}

export default ChatRoomMessages
