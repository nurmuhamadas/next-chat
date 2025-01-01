import { useEffect } from "react"

import Image from "next/image"

import { LoaderIcon } from "lucide-react"

import ChatSkeleton from "@/components/chat-skeleton"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import useGetSetting from "@/features/user/hooks/api/use-get-setting"

import useGetRooms from "../hooks/api/use-get-rooms"

import RoomListItem from "./room-list-item"

const RoomListView = () => {
  const { data: settings, isLoading: settingLoading } = useGetSetting()
  const {
    data: rooms,
    isLoading: loadingRooms,
    refetch,
    hasNextPage,
    fetchNextPage,
  } = useGetRooms({})

  const isLoading = loadingRooms || settingLoading

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch()
    }, 5000)

    return () => {
      clearInterval(intervalId)
    }
  }, [refetch])

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

        {!loadingRooms && hasNextPage && (
          <Button variant="link" onClick={() => fetchNextPage()}>
            Show more
          </Button>
        )}
      </ul>
    </ScrollArea>
  )
}

export default RoomListView
