"use client"

import { useState } from "react"

import { MoreVerticalIcon, SearchIcon } from "lucide-react"

import SearchBar from "@/components/search-bar"
import { Button } from "@/components/ui/button"

import ChatAvatar from "./chat-avatar"

const ChatRoomHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="w-full gap-x-4 bg-surface px-4 py-2 flex-center-between">
      <div className="flex flex-1 cursor-pointer items-center gap-x-3">
        <ChatAvatar className="size-10" />
        <div className="flex flex-1 flex-col">
          <h2 className="line-clamp-1 h5">User Name</h2>
          <p className="line-clamp-1 text-grey-2 caption">Last seen at 12:99</p>
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
        <Button variant="icon" size="icon">
          <MoreVerticalIcon />
        </Button>
      </div>
    </header>
  )
}

export default ChatRoomHeader
