import { useCallback, useEffect, useMemo, useRef } from "react"

import Image from "next/image"

import { useQueryClient } from "@tanstack/react-query"
import { isToday, isYesterday, parseISO } from "date-fns"
import { LoaderIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import useJoinChannel from "@/features/channel/hooks/api/use-join-channel"
import useJoinGroup from "@/features/group/hooks/api/use-join-group"
import useGetMessages from "@/features/messages/hooks/api/use-get-messages"
import useReadMessage from "@/features/messages/hooks/api/use-read-message"
import useGetSetting from "@/features/settings/hooks/use-get-setting"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"
import { useCurrentLocale, useScopedI18n } from "@/lib/locale/client"
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
  const currentLocal = useCurrentLocale()
  const t = useScopedI18n("messages")

  const queryClient = useQueryClient()

  const type = useRoomType()
  const id = useRoomId()

  const lastMessage = useRef<Message | null>(null)

  const { repliedMessageId } = useRepliedMessageId()
  const { editedMessageId } = useEditedMessageId()
  const { deletedMessageId } = useDeletedMessageId()

  const { mutate: joinGroup, isPending: isJoiningGroup } = useJoinGroup()
  const { mutate: joinChannel, isPending: isJoiningChannel } = useJoinChannel()
  const { mutate: readMessage } = useReadMessage()

  const { data: setting } = useGetSetting()
  const {
    data: messages,
    isLoading: loadingMessage,
    hasNextPage,
    fetchNextPage,
  } = useGetMessages({ id, roomType: type })

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
          ? t("time.today")
          : isYesterday(date)
            ? t("time.yestedey")
            : formatChatTime(
                message.createdAt,
                setting?.timeFormat ?? "12-HOUR",
                currentLocal,
              )

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
    [setting?.timeFormat, messagesStr],
  )

  const groupedMessages = groupingMessage(messages)

  useEffect(() => {
    if (!isLoading && repliedMessageId && messagesStr !== "[]") {
      onRepliedMessageChange(messages?.find((m) => m.id === repliedMessageId))
    }
  }, [repliedMessageId, onRepliedMessageChange, isLoading, messagesStr])

  useEffect(() => {
    if (!isLoading && editedMessageId && messagesStr !== "[]") {
      onEditMessageChange(messages?.find((m) => m.id === editedMessageId))
    }
  }, [editedMessageId, onEditMessageChange, isLoading, messagesStr])

  useEffect(() => {
    if (!isLoading && deletedMessageId && messagesStr !== "[]") {
      onDeletedMessageChange(messages?.find((m) => m.id === deletedMessageId))
    }
  }, [deletedMessageId, onDeletedMessageChange, isLoading, messagesStr])

  useEffect(() => {
    if (messages.length > 0) {
      if (lastMessage.current && messages[0].id !== lastMessage.current?.id) {
        readMessage({
          roomType: type,
          receiverId: id,
        })
      }
      lastMessage.current = messages[0]
    }
  }, [messages.length])

  const handleJoinGroup = () => {
    if (group) {
      joinGroup(
        { groupId: group.id, data: { code: group.inviteCode } },
        {
          onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["rooms", 20] })
            queryClient.invalidateQueries({
              queryKey: ["get-group-by-id", id],
            })
            queryClient.invalidateQueries({
              queryKey: ["get-group-members", id],
            })
            queryClient.invalidateQueries({
              queryKey: ["get-group-option", id],
            })
          },
        },
      )
    }
  }

  const handleJoinChannel = () => {
    if (channel) {
      joinChannel(
        { channelId: channel.id, data: { code: channel.inviteCode } },
        {
          onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["rooms", 20] })
            queryClient.invalidateQueries({
              queryKey: ["get-channel-by-id", id],
            })
            queryClient.invalidateQueries({
              queryKey: ["get-channel-option", id],
            })
          },
        },
      )
    }
  }

  if (hideMessage) {
    return (
      <div className="w-full flex-1 flex-center">
        {type === "group" && (
          <div className="w-56 gap-y-6 rounded-lg bg-surface p-6 flex-col-center">
            <p className="text-center body-2">{t("group.only_member")}</p>
            <Button onClick={handleJoinGroup} disabled={isJoiningGroup}>
              {isJoiningGroup && <LoaderIcon className="size-4 animate-spin" />}
              {t("group.join")}
            </Button>
          </div>
        )}
        {type === "channel" && (
          <div className="w-56 gap-y-6 rounded-lg bg-surface p-6 flex-col-center">
            <p className="text-center body-2">{t("channel.only_member")}</p>
            <Button onClick={handleJoinChannel} disabled={isJoiningChannel}>
              {isJoiningChannel && (
                <LoaderIcon className="size-4 animate-spin" />
              )}
              {t("channel.subscribe")}
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
        channel && !channel.isAdmin && "pb-6",
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
            <h4 className="h4">{t("empty")}</h4>
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
          canLoadMore={hasNextPage}
          isLoading={isLoading}
          loadMore={() => {
            if (hasNextPage) {
              fetchNextPage()
            }
          }}
        />
      )}
    </div>
  )
}

export default ChatRoomMessages
