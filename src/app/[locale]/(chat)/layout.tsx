"use client"

import { PropsWithChildren } from "react"

import { useParams } from "next/navigation"

import Sidebar from "@/components/sidebar"
import { cn } from "@/lib/utils"

import { I18nProviderClient } from "../../../lib/locale/client"

const ChatLayout = ({ children }: PropsWithChildren) => {
  const { roomId, roomType, locale } = useParams()

  // const isHome = !roomId && !roomType
  const isRoom = roomId && roomType

  return (
    <I18nProviderClient locale={locale as string}>
      <div className="flex">
        <Sidebar
          className={cn(
            "flex-1 overflow-hidden md:max-w-[384px] md:min-w-[384px]",
            isRoom && "hidden md:flex",
          )}
        />

        {children}
      </div>
    </I18nProviderClient>
  )
}

export default ChatLayout
