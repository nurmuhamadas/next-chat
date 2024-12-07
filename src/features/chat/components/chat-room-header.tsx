"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { ArrowLeftIcon, SearchIcon } from "lucide-react"

import ChatAvatar from "@/components/chat-avatar"
import SearchBar from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import useGetChannelById from "@/features/channel/hooks/api/use-get-channel-by-id"
import useGetGroupById from "@/features/group/hooks/api/use-get-group-by-id"
import useGetUserProfileById from "@/features/user/hooks/api/use-get-profile-by-id"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"
import { cn, mergeName } from "@/lib/utils"

import { useRoomProfile } from "../hooks/use-room-profile"

import ChatRoomMenu from "./chat-room-menu"

const ChatRoomHeader = () => {
  const router = useRouter()

  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const { openRoomProfile } = useRoomProfile()
  const type = useRoomType()
  const roomId = useRoomId()

  const { data: user, isLoading: userLoading } = useGetUserProfileById({
    id: type === "chat" ? roomId : undefined,
  })
  const { data: group, isLoading: groupLoading } = useGetGroupById({
    id: type === "group" ? roomId : undefined,
  })
  const { data: channel, isLoading: channelLoading } = useGetChannelById({
    id: type === "channel" ? roomId : undefined,
  })
  const isLoading = userLoading || groupLoading || channelLoading

  const name = {
    chat: user
      ? mergeName(user?.firstName, user?.lastName ?? undefined)
      : undefined,
    group: group ? group?.name : undefined,
    channel: channel ? channel?.name : undefined,
  }
  const info = {
    chat: undefined,
    group: group ? `${group?.totalMembers} members` : undefined,
    channel: channel ? `${channel?.totalSubscribers} subscribers` : undefined,
  }
  const avatar = {
    chat: user ? (user?.imageUrl ?? "") : undefined,
    group: group ? (group?.imageUrl ?? "") : undefined,
    channel: channel ? (channel?.imageUrl ?? "") : undefined,
  }

  return (
    <header className="w-full gap-x-4 bg-surface px-4 py-2 flex-center-between">
      <div
        className="flex flex-1 cursor-pointer items-center gap-x-3"
        onClick={openRoomProfile}
        aria-label="Open profile"
      >
        <Button
          variant="icon"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/`)
          }}
          className="md:hidden"
        >
          <ArrowLeftIcon />
        </Button>

        {isLoading ? (
          <Skeleton className="size-10 rounded-full" />
        ) : (
          <ChatAvatar
            src={avatar[type]}
            name={name[type]}
            className="size-10"
          />
        )}

        <div className={cn("flex flex-1 flex-col")}>
          {isLoading ? (
            <>
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="mt-1 h-4 w-[100px]" />
            </>
          ) : (
            <>
              {name[type] && <h2 className="line-clamp-1 h5">{name[type]}</h2>}
              {info[type] && (
                <p className="line-clamp-1 text-muted-foreground caption">
                  {info[type]}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex-center-end">
        <div className="">
          {isSearchOpen ? (
            <SearchBar autoFocus onBlur={() => setIsSearchOpen(false)} />
          ) : (
            <Button
              variant="icon"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
            >
              <SearchIcon />
            </Button>
          )}
        </div>

        <ChatRoomMenu type={type} />
      </div>
    </header>
  )
}

export default ChatRoomHeader
