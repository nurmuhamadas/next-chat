"use client"

import {
  BellOffIcon,
  LogOutIcon,
  LucideIcon,
  MoreVerticalIcon,
  TrashIcon,
  UserXIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ChatRoomMenuProps {
  type: RoomType
}

const ChatRoomMenu = ({ type }: ChatRoomMenuProps) => {
  const menuList: Record<
    RoomType,
    {
      label: string
      icon: LucideIcon
      danger?: boolean
      action(): void
    }[]
  > = {
    chat: [
      {
        label: "Mute",
        icon: BellOffIcon,
        action() {},
      },
      {
        label: "Block User",
        icon: UserXIcon,
        action() {},
      },
      {
        label: "Delete Chat",
        icon: TrashIcon,
        danger: true,
        action() {},
      },
    ],
    group: [
      {
        label: "Mute",
        icon: BellOffIcon,
        action() {},
      },
      {
        label: "Leave Group",
        icon: LogOutIcon,
        action() {},
      },
      {
        label: "Delete and Exit",
        icon: TrashIcon,
        danger: true,
        action() {},
      },
    ],
    channel: [
      {
        label: "Mute",
        icon: BellOffIcon,
        action() {},
      },
      {
        label: "Leave Channel",
        icon: LogOutIcon,
        action() {},
      },
      {
        label: "Delete and Exit",
        icon: TrashIcon,
        danger: true,
        action() {},
      },
    ],
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:outline-none">
        <Button variant="icon" size="icon">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" className="min-w-52">
        {menuList[type].map((menu) => {
          return (
            <DropdownMenuItem
              key={menu.label}
              className={cn(
                "py-2.5",
                menu.danger && "text-error hover:!text-error",
              )}
              onClick={menu.action}
            >
              <menu.icon /> {menu.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ChatRoomMenu
