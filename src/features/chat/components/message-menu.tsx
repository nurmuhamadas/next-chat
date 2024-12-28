import { ChevronDownIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn, copyMessage } from "@/lib/utils"

import { messageItemMenu } from "../constants"
import { useDeletedMessageId } from "../hooks/use-deleted-message-id"
import { useEditedMessageId } from "../hooks/use-edited-message-id"
import { useForwardMessageModal } from "../hooks/use-forward-message-modal"
import { useRepliedMessageId } from "../hooks/use-replied-message-id"
import { useSelectedMessageIds } from "../hooks/use-selected-message-ids"

interface MessageMenuProps {
  isAdmin: boolean
  message: Message
}

const MessageMenu = ({ isAdmin, message }: MessageMenuProps) => {
  const { replyMessage, cancelReplyMessage } = useRepliedMessageId()
  const { editMessage, cancelEditMessage } = useEditedMessageId()
  const { toggleSelectMessage } = useSelectedMessageIds()
  const { deleteMessage } = useDeletedMessageId()
  const { forwardMessage } = useForwardMessageModal()

  const handleMenuClick = (action: MessageItemMenuAction) => {
    switch (action) {
      case "reply":
        cancelEditMessage()
        replyMessage(message.id)
        break
      case "edit":
        cancelReplyMessage()
        editMessage(message.id)
        break
      case "copy-text":
        if (message.message) {
          copyMessage(message.message)
        }
        break
      case "pin":
        break
      case "forward":
        forwardMessage(message.id)
        break
      case "select":
        toggleSelectMessage(message.id)
        break
      case "delete":
        deleteMessage(message.id)
        break
      default:
        break
    }
  }

  const fixedMenu = messageItemMenu.filter((menu) => {
    if (message.isSender) {
      if (!message.message) {
        return menu.action !== "edit" && menu.action !== "copy-text"
      }

      return true
    }

    if (isAdmin) {
      if (!message.message) {
        return menu.action !== "edit" && menu.action !== "copy-text"
      }
      return menu.action !== "edit"
    }

    if (!message.message) {
      return (
        menu.action !== "edit" &&
        menu.action !== "copy-text" &&
        menu.action !== "delete"
      )
    }
    return menu.action !== "edit" && menu.action !== "delete"
  })

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <ChevronDownIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" className="min-w-52">
          {fixedMenu.map((menu) => {
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
    </>
  )
}

export default MessageMenu
