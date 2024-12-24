import { useState } from "react"

import Image from "next/image"

import ChatSkeleton from "@/components/chat-skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import useGetSetting from "@/features/user/hooks/api/use-get-setting"

import useGetRooms from "../hooks/api/use-get-rooms"

import ChatListItem from "./chat-list-item"

const ChatListView = () => {
  const [cursor] = useState<string | undefined>(undefined)

  const { data: settings, isLoading: settingLoading } = useGetSetting()
  const { data, isLoading } = useGetRooms({ cursor })

  if (isLoading || settingLoading) {
    return <ChatSkeleton rows={5} />
  }

  if (data.length === 0) {
    return (
      <div className="flex-1 flex-center">
        <div className="gap-y-6 flex-col-center">
          <Image
            src="/images/on-a-break.svg"
            alt="no conversation"
            width={160}
            height={127}
          />
          <div className="gap-y-2 flex-col-center">
            <h4 className="h4">No Conversation found</h4>
            <p className="body-2">
              Search and select user to start the conversation
            </p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <ScrollArea className="chat-list-scroll-area">
      <ul className="flex min-w-10 flex-col px-1.5 pt-2">
        {data.map((v) => {
          return (
            <ChatListItem
              key={v.id}
              timeFormat={settings?.timeFormat ?? "12-HOUR"}
              data={v}
            />
          )
        })}
      </ul>
    </ScrollArea>
  )
}

export default ChatListView
