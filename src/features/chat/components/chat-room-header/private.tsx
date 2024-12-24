"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { ArrowLeftIcon, SearchIcon } from "lucide-react"

import ChatAvatar from "@/components/chat-avatar"
import SearchBar from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import useGetUserProfileById from "@/features/user/hooks/api/use-get-profile-by-id"
import useGetSetting from "@/features/user/hooks/api/use-get-setting"
import { useRoomId } from "@/hooks/use-room-id"
import { cn, formatChatTime } from "@/lib/utils"

import { useRoomProfile } from "../../hooks/use-room-profile"

interface ChatRoomHeaderPrivateProps {
  conversation?: Conversation
}
const ChatRoomHeaderPrivate = ({}: ChatRoomHeaderPrivateProps) => {
  const router = useRouter()

  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const { openRoomProfile } = useRoomProfile()

  const id = useRoomId()

  const { data: user, isLoading: loadingUser } = useGetUserProfileById({ id })
  const { data: setting, isLoading: loadingSetting } = useGetSetting()

  const isLoading = loadingUser || loadingSetting

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
            src={user?.imageUrl ?? ""}
            name={user?.name}
            className="size-10"
          />
        )}

        <div className={cn("flex flex-1 flex-col")}>
          {isLoading ? (
            <>
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="mt-1 h-4 w-[100px]" />
            </>
          ) : user ? (
            <>
              <h2 className="line-clamp-1 h5">{user?.name}</h2>
              {user.lastSeenAt && (
                <p className="line-clamp-1 text-muted-foreground caption">
                  Last seen at{" "}
                  {formatChatTime(
                    user.lastSeenAt,
                    setting?.timeFormat ?? "12-HOUR",
                  )}
                </p>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* TODO: search features */}
      {!!user && false && (
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

          {/* <ChatRoomMenu type={type} /> */}
        </div>
      )}
    </header>
  )
}

export default ChatRoomHeaderPrivate
