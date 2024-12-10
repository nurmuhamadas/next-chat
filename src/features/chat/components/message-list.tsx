"use client"

import { useEffect, useRef } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useGetMyProfile } from "@/features/user/hooks/api/use-get-my-profile"

import { useSelectedMessageIds } from "../hooks/use-selected-message-ids"

import MessageItem from "./message-item"

export type GroupedMessage = { time: string; messages: Message[] }
interface MessageListProps {
  messages: GroupedMessage[]
  timeFormat?: TimeFormat
}
const MessageList = ({
  messages: groupedMessages,
  timeFormat,
}: MessageListProps) => {
  const chatRef = useRef<HTMLDivElement>(null)

  const { selectedMessageIds } = useSelectedMessageIds()

  const { data: myProfile } = useGetMyProfile()

  useEffect(() => {
    const chatContainer = chatRef.current
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }, [])

  return (
    <ScrollArea ref={chatRef} className="chat-list-scroll-area size-full">
      <div className="mx-auto flex w-full max-w-[700px] flex-col-reverse gap-y-2 px-4 pt-4">
        {groupedMessages.map(({ time, messages }) => {
          return (
            <div className="" key={time}>
              <div className="mb-3 flex items-center">
                <Separator className="flex-1" />
                <div className="rounded-full bg-surface px-2 py-1 caption">
                  {time}
                </div>
                <Separator className="flex-1" />
              </div>

              <div className="flex flex-col-reverse gap-y-2">
                {messages.map((message) => {
                  return (
                    <MessageItem
                      key={message.id}
                      message={message}
                      type="private"
                      isSelected={selectedMessageIds.includes(message.id)}
                      isSender={myProfile?.id === message.user.id}
                      timeFormat={timeFormat}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}

export default MessageList
