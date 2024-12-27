import { useEffect, useState } from "react"

import Link from "next/link"

import ChatAvatar from "@/components/chat-avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import useGetChannelOption from "@/features/channel/hooks/api/use-get-channel-option"
import useGetChannelSubscribers from "@/features/channel/hooks/api/use-get-channel-subscribers"
import { useRoomId } from "@/hooks/use-room-id"

import { useRoomProfile } from "../../hooks/use-room-profile"

const RoomProfileMembersChannel = () => {
  const id = useRoomId()

  const { roomProfileOpen } = useRoomProfile()

  const [subscribers, setSubscribers] = useState<ChannelSubscriber[]>([])

  const { data: channelOption, isLoading: loadingOption } = useGetChannelOption(
    { channelId: roomProfileOpen ? id : undefined },
  )
  const { data: subsResult, isLoading: loadingSubs } = useGetChannelSubscribers(
    { channelId: roomProfileOpen ? id : undefined },
  )

  const isLoading = loadingOption || loadingSubs
  const isNoSubsView = isLoading || !channelOption || subscribers.length === 0

  useEffect(() => {
    if (!isLoading && channelOption && subsResult) {
      setSubscribers(subsResult)
    }
  }, [isLoading])

  if (isNoSubsView) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-1 p-2">
      <h3 className="px-2 text-grey-2 subtitle-2">Subscribers</h3>
      {subscribers.length > 0 && (
        <div className="max-h-56">
          <ScrollArea className="chat-list-scroll-area">
            <ul className="flex flex-col px-1.5 pt-2">
              {subscribers.map((v) => {
                return (
                  <li
                    className="flex cursor-pointer items-center gap-x-3 rounded-md px-3 py-2 hover:bg-grey-4"
                    key={v.id}
                  >
                    <Link href={`/chat/${v.id}`}>
                      <ChatAvatar src={v.imageUrl ?? ""} name={v.name} />
                    </Link>
                    <p className="line-clamp-1 flex-1 subtitle-2">{v.name}</p>
                    {v.isAdmin && (
                      <span className="text-grey-3 body-2">Admin</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

export default RoomProfileMembersChannel
