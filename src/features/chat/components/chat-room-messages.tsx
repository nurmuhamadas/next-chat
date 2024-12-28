import { useCallback, useEffect, useMemo, useState } from "react"

import Image from "next/image"

import { isToday, parseISO } from "date-fns"
import { LoaderIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import useJoinChannel from "@/features/channel/hooks/api/use-join-channel"
import useJoinGroup from "@/features/group/hooks/api/use-join-group"
import useGetMessages from "@/features/messages/hooks/api/use-get-messages"
import useGetSetting from "@/features/user/hooks/api/use-get-setting"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"
import { cn, formatChatTime } from "@/lib/utils"

import { useDeletedMessageId } from "../hooks/use-deleted-message-id"
import { useEditedMessageId } from "../hooks/use-edited-message-id"
import { useRepliedMessageId } from "../hooks/use-replied-message-id"

import MessageList, { GroupedMessage, MessageLoading } from "./message-list"

interface ChatRoomMessagesProps {
  hideMessage?: boolean
  group?: Group
  channel?: Channel
  onRepliedMessageChange(message: Message | undefined): void
  onEditMessageChange(message: Message | undefined): void
  onDeletedMessageChange(message: Message | undefined): void
}
const ChatRoomMessages = ({
  hideMessage,
  group,
  channel,
  onRepliedMessageChange,
  onEditMessageChange,
  onDeletedMessageChange,
}: ChatRoomMessagesProps) => {
  const type = useRoomType()
  const id = useRoomId()

  const { repliedMessageId } = useRepliedMessageId()
  const { editedMessageId } = useEditedMessageId()
  const { deletedMessageId } = useDeletedMessageId()

  const [cursor, setCursor] = useState<string | undefined>()
  const [messages, setMessages] = useState<Message[]>([])

  const { mutate: joinGroup, isPending: isJoiningGroup } = useJoinGroup()
  const { mutate: joinChannel, isPending: isJoiningChannel } = useJoinChannel()

  const { data: setting } = useGetSetting()
  const {
    data: messagesResult,
    isLoading: loadingMessage,
    cursor: cursorResult,
  } = useGetMessages({ id, roomType: type, cursor })

  const messagesResultStr = useMemo(
    () => JSON.stringify(messagesResult),
    [messagesResult],
  )
  const messagesStr = useMemo(() => JSON.stringify(messages), [messages])

  const isLoading = loadingMessage
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
    if (!isLoading) {
      if (cursor) {
        setMessages((prev) =>
          [
            ...prev.filter((m) => !messagesResult.some((r) => r.id === m.id)),
            ...messagesResult,
          ].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        )
      } else {
        setMessages([...messagesResult])
      }
    }
  }, [type, isLoading, cursor, messagesResultStr])

  useEffect(() => {
    if (!isLoading) {
      onRepliedMessageChange(messages?.find((m) => m.id === repliedMessageId))
    }
  }, [repliedMessageId, onRepliedMessageChange, isLoading, messagesStr])

  useEffect(() => {
    if (!isLoading) {
      onEditMessageChange(messages?.find((m) => m.id === editedMessageId))
    }
  }, [editedMessageId, onEditMessageChange, isLoading, messagesStr])

  useEffect(() => {
    if (!isLoading) {
      onDeletedMessageChange(messages?.find((m) => m.id === deletedMessageId))
    }
  }, [deletedMessageId, onDeletedMessageChange, isLoading, messagesStr])

  const handleJoinGroup = () => {
    if (group) {
      joinGroup({
        param: { groupId: group.id },
        json: { code: group.inviteCode },
      })
    }
  }

  const handleJoinChannel = () => {
    if (channel) {
      joinChannel({
        param: { channelId: channel.id },
        json: { code: channel.inviteCode },
      })
    }
  }

  if (hideMessage) {
    return (
      <div className="w-full flex-1 flex-center">
        {type === "group" && (
          <div className="w-56 gap-y-6 rounded-lg bg-surface p-6 flex-col-center">
            <p className="text-center body-2">
              Only group members can view the messages.
            </p>
            <Button onClick={handleJoinGroup} disabled={isJoiningGroup}>
              {isJoiningGroup && <LoaderIcon className="size-4 animate-spin" />}
              Join Group
            </Button>
          </div>
        )}
        {type === "channel" && (
          <div className="w-56 gap-y-6 rounded-lg bg-surface p-6 flex-col-center">
            <p className="text-center body-2">
              Only channel subscribers can view the messages.
            </p>
            <Button onClick={handleJoinChannel} disabled={isJoiningChannel}>
              {isJoiningChannel && (
                <LoaderIcon className="size-4 animate-spin" />
              )}
              Subscribe Channel
            </Button>
          </div>
        )}
      </div>
    )
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
            priority
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
        <div className="mx-auto size-full max-w-[700px] px-4">
          <MessageLoading />
        </div>
      )}
      {!isEmpty && (
        <MessageList
          isAdmin={group?.isAdmin || channel?.isAdmin || false}
          messages={groupedMessages}
          timeFormat={setting?.timeFormat ?? "12-HOUR"}
          canLoadMore={!!cursorResult}
          isLoading={isLoading}
          loadMore={() => {
            if (cursorResult) {
              setCursor(cursorResult)
            }
          }}
        />
      )}
    </div>
  )
}

export default ChatRoomMessages
