import { useEffect, useState } from "react"

import Image from "next/image"

import { LoaderIcon } from "lucide-react"

import ChatSkeleton from "@/components/chat-skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import useGetSetting from "@/features/user/hooks/api/use-get-setting"

import useGetRooms from "../hooks/api/use-get-rooms"

import RoomListItem from "./room-list-item"

const RoomListView = () => {
  const [cursor] = useState<string | undefined>(undefined)
  const [rooms, setRooms] = useState<Room[]>([])

  const { data: settings, isLoading: settingLoading } = useGetSetting()
  const { data: roomsResult, isFetching: loadingRooms } = useGetRooms({
    cursor,
  })

  const isLoading = loadingRooms || settingLoading

  useEffect(() => {
    if (!loadingRooms && roomsResult.length > 0) {
      setRooms((v) => {
        const newRooms = [
          ...v.filter((room) => !roomsResult.some((res) => res.id === room.id)),
          ...roomsResult,
        ].sort((a, b) => {
          if (b.lastMessage && a.lastMessage) {
            return b.lastMessage.id.localeCompare(a.lastMessage.id)
          }
          if (b.lastMessage) {
            return b.lastMessage.id.localeCompare(a.id)
          }
          if (a.lastMessage) {
            return b.id.localeCompare(a.lastMessage.id)
          }
          return b.id.localeCompare(a.id)
        })

        return newRooms
      })
    }
  }, [loadingRooms])

  if (isLoading && rooms.length === 0) {
    return <ChatSkeleton rows={5} />
  }

  if (rooms.length === 0) {
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
        {rooms.map((room) => {
          return (
            <RoomListItem
              key={room.id}
              timeFormat={settings?.timeFormat ?? "12-HOUR"}
              data={room}
            />
          )
        })}

        {loadingRooms && rooms.length > 0 && (
          <div className="h-24 flex-center">
            <LoaderIcon className="size-5 animate-spin" />
          </div>
        )}
      </ul>
    </ScrollArea>
  )
}

export default RoomListView
