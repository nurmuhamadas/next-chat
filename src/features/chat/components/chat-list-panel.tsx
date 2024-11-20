import Image from "next/image"

import { MenuIcon } from "lucide-react"

import SearchBar from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import ChatListItem from "./chat-list-item"

const ChatListPanel = () => {
  const data = [1]

  return (
    <div className="relative flex size-full flex-col pt-[52px]">
      <div className="absolute left-0 top-0 flex w-full items-center gap-x-4 py-1.5 pl-4 pr-2.5">
        <Button size="icon-sm" variant="icon">
          <MenuIcon />
        </Button>

        <SearchBar />
      </div>

      {data.length === 0 && (
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
      )}

      {data.length > 0 && (
        <ScrollArea className="w-full ">
          <ul className="flex max-w-[384px] flex-col px-1.5 pt-2">
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
            <ChatListItem />
          </ul>
        </ScrollArea>
      )}
    </div>
  )
}

export default ChatListPanel
