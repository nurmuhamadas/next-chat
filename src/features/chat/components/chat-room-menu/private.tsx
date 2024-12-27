"use client"

import { useQueryClient } from "@tanstack/react-query"
import { LoaderIcon, MoreVerticalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useBlockUser from "@/features/blocked-users/hooks/api/use-block-user"
import useGetIsUserBlocked from "@/features/blocked-users/hooks/api/use-get-is-user-blocked"
import useUnblockUser from "@/features/blocked-users/hooks/api/use-unblock-user"
import useClearPrivateChat from "@/features/private-chat/hooks/api/use-clear-private-chat"
import useGetPrivateChatOption from "@/features/private-chat/hooks/api/use-get-private-chat-option"
import useUpdatePrivateChatOption from "@/features/private-chat/hooks/api/use-update-private-chat-option"
import useConfirm from "@/hooks/use-confirm-dialog"
import { useRoomId } from "@/hooks/use-room-id"
import { cn } from "@/lib/utils"

import { chatRoomPrivateMenu } from "../../constants"

const ChatRoomMenuPrivate = () => {
  const queryClient = useQueryClient()

  const id = useRoomId()

  const [Dialog, confirm] = useConfirm()

  const { mutate: updateOption, isPending: isUpdatingOption } =
    useUpdatePrivateChatOption()
  const { mutate: blockUser, isPending: isBlocking } = useBlockUser()
  const { mutate: unblockUser, isPending: isUnblocking } = useUnblockUser()
  const { mutate: clearChat, isPending: isClearingChat } = useClearPrivateChat()

  const {
    data: chatOption,
    isLoading: chatOptionLoading,
    refetch: refetchOption,
  } = useGetPrivateChatOption({ userId: id })
  const {
    data: isBlocked,
    isLoading: blokedLoading,
    refetch: refetchBlocked,
  } = useGetIsUserBlocked({
    userId: id,
  })

  const isLoading = chatOptionLoading || blokedLoading
  const isNoMenu = isLoading

  const handleToggleMute = async (muted: boolean) => {
    const isOK = await confirm(
      muted ? "MUTE_CONFIRM_TITLE" : "UNMUTE_CONFIRM_TITLE",
      muted ? "MUTE_CONFIRM_MESSAGE" : "UNMUTE_CONFIRM_MESSAGE",
    )
    if (!isOK) return

    updateOption(
      { param: { userId: id }, json: { notification: !muted } },
      {
        onSuccess() {
          refetchOption()
        },
      },
    )
  }

  const handleBlockUser = async () => {
    const isOK = await confirm(
      "BLOCK_USER_CONFIRM_TITLE",
      "BLOCK_USER_CONFIRM_MESSAGE",
    )
    if (!isOK) return

    blockUser(
      { param: { blockedUserId: id } },
      {
        onSuccess() {
          refetchBlocked()
          queryClient.invalidateQueries({ queryKey: ["get-blocked-users"] })
        },
      },
    )
  }

  const handleUnblockUser = async () => {
    const isOK = await confirm(
      "UNBLOCK_USER_CONFIRM_TITLE",
      "UNBLOCK_USER_CONFIRM_MESSAGE",
    )
    if (!isOK) return

    unblockUser(
      { param: { blockedUserId: id } },
      {
        onSuccess() {
          refetchBlocked()
          queryClient.invalidateQueries({ queryKey: ["get-blocked-users"] })
        },
      },
    )
  }

  const handleDeleteChat = async () => {
    const isOK = await confirm(
      "DELETE_CHAT_CONFIRM_TITLE",
      "DELETE_CHAT_CONFIRM_MESSAGE",
    )
    if (!isOK) return

    clearChat(
      { param: { userId: id } },
      {
        onSuccess() {
          refetchOption()
        },
      },
    )
  }

  const handleMenuClick = (action: ChatRoomPrivateMenuAction) => {
    switch (action) {
      case "mute-chat":
        handleToggleMute(true)
        break
      case "unmute-chat":
        handleToggleMute(false)
        break
      case "block-user":
        handleBlockUser()
        break
      case "unblock-user":
        handleUnblockUser()
        break
      case "delete-chat":
        handleDeleteChat()
        break
      default:
        break
    }
  }

  if (isNoMenu) {
    return null
  }

  const isActionLoading: Record<ChatRoomPrivateMenuAction, boolean> = {
    "mute-chat": isUpdatingOption,
    "unmute-chat": isUpdatingOption,
    "block-user": isBlocking,
    "unblock-user": isUnblocking,
    "delete-chat": isClearingChat,
  }

  const isMenuShown: Record<ChatRoomPrivateMenuAction, boolean> = {
    "mute-chat": chatOption ? chatOption.notification : false,
    "unmute-chat": chatOption ? !chatOption.notification : false,
    "block-user": !isBlocked,
    "unblock-user": isBlocked!,
    "delete-chat": !!chatOption,
  }

  const menuList = chatRoomPrivateMenu.filter((menu) => {
    return isMenuShown[menu.action]
  })

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="focus:outline-none">
          <Button variant="icon" size="icon">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" className="min-w-52">
          {menuList.map((menu) => {
            return (
              <DropdownMenuItem
                key={menu.label}
                className={cn(
                  "py-2.5",
                  menu.danger && "text-error hover:!text-error",
                )}
                disabled={isActionLoading[menu.action]}
                onClick={() => handleMenuClick(menu.action)}
              >
                {isActionLoading[menu.action] ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  <menu.icon />
                )}{" "}
                {menu.label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog />
    </>
  )
}

export default ChatRoomMenuPrivate
