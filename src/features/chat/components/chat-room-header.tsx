"use client"

import { useState } from "react"

import { useParams, useRouter } from "next/navigation"

import { ArrowLeftIcon, SearchIcon } from "lucide-react"

import SearchBar from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import ChatAvatar from "./chat-avatar"
import ChatRoomMenu from "./chat-room-menu"

interface ChatRoomHeaderProps {
  onHeaderClick?(): void
}

const ChatRoomHeader = ({ onHeaderClick }: ChatRoomHeaderProps) => {
  const router = useRouter()
  const params = useParams()
  const type = params.roomType as RoomType

  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="w-full gap-x-4 bg-surface px-4 py-2 flex-center-between">
      <div
        className="flex flex-1 cursor-pointer items-center gap-x-3"
        onClick={onHeaderClick}
        aria-label="Open profile"
      >
        <Button
          variant="icon"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            router.back()
          }}
          className="md:hidden"
        >
          <ArrowLeftIcon />
        </Button>

        <ChatAvatar className="size-10" />

        <div className={cn("flex flex-1 flex-col")}>
          <h2 className="line-clamp-1 h5">User Name</h2>
          <p className="line-clamp-1 text-grey-2 caption">
            {type === "chat" && "Last seen at"}
            {type === "group" && "2 members"}
            {type === "channel" && "2 subscribers"}
          </p>
        </div>
      </div>

      <div className="flex-center-end">
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

        <ChatRoomMenu type={type} />
      </div>
    </header>
  )
}

export default ChatRoomHeader
