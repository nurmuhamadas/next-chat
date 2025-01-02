"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { ArrowLeftIcon, SearchIcon } from "lucide-react"

import ChatAvatar from "@/components/chat-avatar"
import SearchBar from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import useGetGroupById from "@/features/group/hooks/api/use-get-group-by-id"
import { useRoomId } from "@/hooks/use-room-id"
import { useScopedI18n } from "@/lib/locale/client"
import { cn } from "@/lib/utils"

import { useRoomProfile } from "../../hooks/use-room-profile"
import ChatRoomMenuGroup from "../chat-room-menu/group"

const ChatRoomHeaderGroup = () => {
  const router = useRouter()

  const t = useScopedI18n("group")

  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const { openRoomProfile } = useRoomProfile()

  const id = useRoomId()

  const { data: group, isLoading: loadingGroup } = useGetGroupById({ id })

  const isLoading = loadingGroup

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
            src={group?.imageUrl ?? ""}
            name={group?.name}
            className="size-10"
          />
        )}

        <div className={cn("flex flex-1 flex-col")}>
          {isLoading ? (
            <>
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="mt-1 h-4 w-[100px]" />
            </>
          ) : group ? (
            <>
              <h2 className="line-clamp-1 h5">{group?.name}</h2>
              <p className="line-clamp-1 text-muted-foreground caption">
                {t("info.total_members", { count: group?.totalMembers })}
              </p>
            </>
          ) : null}
        </div>
      </div>

      {/* TODO: search feature, s only shown for members */}
      {false && (
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
        </div>
      )}

      <div className="flex-center-end">
        <ChatRoomMenuGroup />
      </div>
    </header>
  )
}

export default ChatRoomHeaderGroup
