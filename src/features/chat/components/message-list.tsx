"use client"

import { useEffect, useRef } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useGetMyProfile } from "@/features/user/hooks/api/use-get-my-profile"

import { useSelectedMessageIds } from "../hooks/use-selected-message-ids"

import MessageItem from "./message-item"

interface MessageListProps {
  messages: Message[]
}
const MessageList = ({ messages }: MessageListProps) => {
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
        {messages.map((message) => {
          return (
            <MessageItem
              key={message.id}
              message={message}
              type="private"
              isSelected={selectedMessageIds.includes(message.id)}
              isSender={myProfile?.id === message.user.id}
            />
          )
        })}
      </div>
    </ScrollArea>
  )
}

export default MessageList
