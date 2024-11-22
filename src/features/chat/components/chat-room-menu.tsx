"use client"

import { MoreVerticalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useConfirm from "@/hooks/use-confirm-dialog"
import { cn } from "@/lib/utils"

import { chatRoomMenu } from "../constants"

interface ChatRoomMenuProps {
  type: RoomType
}

const ChatRoomMenu = ({ type }: ChatRoomMenuProps) => {
  const [Dialog, confirm] = useConfirm()

  const handleMute = async () => {
    const isOK = await confirm("Title", "Message")
    if (!isOK) return

    console.log("Confirm")
  }

  const handleMenuClick = (action: ChatRoomMenuAction) => {
    switch (action) {
      case "mute-chat":
        handleMute()
        break
      case "block-user":
        break
      case "delete-chat":
        break
      case "mute-group":
        break
      case "leave-group":
        break
      case "delete-and-exit-group":
        break
      case "mute-channel":
        break
      case "leave-channel":
        break
      case "delete-and-exit-channel":
        break
      default:
        break
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="focus:outline-none">
          <Button variant="icon" size="icon">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" className="min-w-52">
          {chatRoomMenu[type].map((menu) => {
            return (
              <DropdownMenuItem
                key={menu.label}
                className={cn(
                  "py-2.5",
                  menu.danger && "text-error hover:!text-error",
                )}
                onClick={() => handleMenuClick(menu.action)}
              >
                <menu.icon /> {menu.label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog />
    </>
  )
}

export default ChatRoomMenu
