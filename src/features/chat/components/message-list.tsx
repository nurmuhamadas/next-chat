"use client"

import { useEffect, useRef } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetMyProfile } from "@/features/user/hooks/api/use-get-my-profile"

import { useSelectedMessageIds } from "../hooks/use-selected-message-ids"

import MessageItem from "./message-item"

export type GroupedMessage = { time: string; messages: Message[] }
interface MessageListProps {
  messages: GroupedMessage[]
  timeFormat?: TimeFormat
  canLoadMore: boolean
  isLoading: boolean
  loadMore(): void
}
const MessageList = ({
  messages: groupedMessages,
  timeFormat,
  canLoadMore,
  isLoading,
  loadMore,
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
      <div
        className="h-1"
        ref={(el) => {
          if (el) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore && !isLoading) {
                  loadMore()
                }
              },
              { threshold: 1 },
            )

            observer.observe(el)

            return () => observer.disconnect()
          }
        }}
      />

      <div className="mx-auto flex min-h-full w-full max-w-[700px] flex-col-reverse gap-y-2 px-4 pt-4">
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
                      isSender={myProfile?.id === message.sender.id}
                      timeFormat={timeFormat}
                      onClickParentMessage={(id) => {
                        const container = chatRef.current
                        const element = document.getElementById(id)

                        if (container && element) {
                          container.scrollTop = element.offsetTop
                        }
                      }}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
        {isLoading && <MessageLoading />}
      </div>
    </ScrollArea>
  )
}

export const MessageLoading = () => {
  return (
    <div className="mx-auto flex size-full flex-1 flex-col justify-end gap-y-2">
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

export default MessageList
