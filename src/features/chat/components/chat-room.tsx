"use client"

import { useState } from "react"

import Image from "next/image"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import ProfilePanel from "@/features/chat/components/profile-panel"
import useWindowSize from "@/hooks/useWindowSize"
import { cn } from "@/lib/utils"

import ChatInput from "./chat-input"
import ChatRoomHeader from "./chat-room-header"

const ChatRoom = () => {
  const { isDesktop } = useWindowSize()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const isEmpty = true

  return (
    <div className="flex h-screen flex-1 overflow-x-hidden">
      <div className="flex-1 transition-all duration-200 ease-linear flex-col-center">
        <ChatRoomHeader onHeaderClick={() => setIsProfileOpen(true)} />

        <div className="w-full flex-1 justify-end overflow-y-auto flex-col-center">
          {isEmpty && (
            <div className="m-auto gap-y-6 flex-col-center">
              <Image
                src="/images/no-message.svg"
                alt="no conversation"
                width={200}
                height={169}
                className="h-auto w-28 lg:w-32"
              />
              <div className="gap-y-2 flex-col-center">
                <h4 className="h4">No Messages</h4>
                <p className="body-2">Send message and start conversation</p>
              </div>
            </div>
          )}

          <ChatInput />
        </div>
      </div>

      {isDesktop ? (
        <div
          className={cn(
            isProfileOpen ? "flex-1 max-w-[384px]" : "max-w-0",
            "transition-all ease-linear duration-200 hidden lg:block border-l border-grey-1 ",
          )}
        >
          <ProfilePanel onClose={() => setIsProfileOpen(false)} />
        </div>
      ) : (
        <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <SheetContent className="w-full max-w-[420px] border-none bg-surface p-0 sm:max-w-[420px]">
            <SheetHeader className="hidden">
              <SheetTitle>User name profile</SheetTitle>
            </SheetHeader>

            <ProfilePanel onClose={() => setIsProfileOpen(false)} />
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

export default ChatRoom
