/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useScopedI18n } from "@/lib/locale/client"
import { cn } from "@/lib/utils"

import { chatRoomPrivateMenu } from "../../constants"

const ChatRoomMenuPrivate = () => {
  const queryClient = useQueryClient()

  const t = useScopedI18n("room_menu.private")

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
      muted ? t("confirm_mute.title") : t("confirm_unmute.title"),
      muted ? t("confirm_mute.message") : t("confirm_unmute.message"),
    )
    if (!isOK) return

    updateOption(
      { userId: id, option: { notification: !muted } },
      {
        onSuccess() {
          refetchOption()
        },
      },
    )
  }

  const handleBlockUser = async () => {
    const isOK = await confirm(
      t("confirm_block.title"),
      t("confirm_block.message"),
    )
    if (!isOK) return

    blockUser(
      { blockedUserId: id },
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
      t("confirm_unblock.title"),
      t("confirm_unblock.message"),
    )
    if (!isOK) return

    unblockUser(
      { blockedUserId: id },
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
      t("confirm_delete.title"),
      t("confirm_delete.message"),
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
                {t(menu.label as any)}
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
