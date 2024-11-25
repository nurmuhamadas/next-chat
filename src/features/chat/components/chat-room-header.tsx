"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { ArrowLeftIcon, SearchIcon } from "lucide-react"

import ChatAvatar from "@/components/chat-avatar"
import SearchBar from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { useRoomType } from "@/hooks/use-room-type"
import { cn } from "@/lib/utils"

import { useRoomProfile } from "../hooks/use-room-profile"

import ChatRoomMenu from "./chat-room-menu"

const ChatRoomHeader = () => {
  const router = useRouter()

  const { openRoomProfile } = useRoomProfile()
  const type = useRoomType()

  const [isSearchOpen, setIsSearchOpen] = useState(false)

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

        <ChatAvatar className="size-10" />

        <div className={cn("flex flex-1 flex-col")}>
          <h2 className="line-clamp-1 h5">
            {type === "chat" && "User Name"}
            {type === "group" && "Group Name"}
            {type === "channel" && "Channel Name"}
          </h2>
          <p className="line-clamp-1 text-muted-foreground caption">
            {type === "chat" && "Last seen at"}
            {type === "group" && "2 members"}
            {type === "channel" && "2 subscribers"}
          </p>
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
