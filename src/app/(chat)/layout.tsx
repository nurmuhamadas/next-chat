"use client"

import { PropsWithChildren } from "react"

import { useParams } from "next/navigation"

import Sidebar from "@/components/sidebar"
import { cn } from "@/lib/utils"

const ChatLayout = ({ children }: PropsWithChildren) => {
  const { roomId, roomType } = useParams()

  // const isHome = !roomId && !roomType
  const isRoom = roomId && roomType

  return (
    <div className="flex">
      <Sidebar
        className={cn(
          "flex-1 overflow-hidden md:max-w-[384px] md:min-w-[384px]",
          isRoom && "hidden md:flex",
        )}
      />

      {children}
    </div>
  )
}

export default ChatLayout
