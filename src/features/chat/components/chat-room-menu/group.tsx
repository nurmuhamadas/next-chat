"use client"

import { LoaderIcon, MoreVerticalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useDeleteGroupChat from "@/features/group/hooks/api/use-delete-group-chat"
import useGetGroupOption from "@/features/group/hooks/api/use-get-group-option"
import useLeaveGroup from "@/features/group/hooks/api/use-leave-group"
import useUpdateGroupOption from "@/features/group/hooks/api/use-update-group-option"
import useConfirm from "@/hooks/use-confirm-dialog"
import { useRoomId } from "@/hooks/use-room-id"
import { cn } from "@/lib/utils"

import { chatRoomGroupMenu } from "../../constants"
import useGetRoom from "../../hooks/api/use-get-room"

const ChatRoomMenuGroup = () => {
  const id = useRoomId()

  const [Dialog, confirm] = useConfirm()

  const { mutate: updateOption, isPending: isUpdatingOption } =
    useUpdateGroupOption()
  const { mutate: leaveGroup, isPending: isLeavingGroup } = useLeaveGroup()
  const { mutate: clearChat, isPending: isClearingChat } = useDeleteGroupChat()

  const {
    data: groupOption,
    isLoading: groupOptionLoading,
    refetch: refetchOption,
  } = useGetGroupOption({ groupId: id })
  const {
    data: room,
    isLoading: loadingRoom,
    refetch: refetchRoom,
  } = useGetRoom({ id })

  const isLoading = groupOptionLoading || loadingRoom
  const isNoMenu = isLoading || !groupOption

  const handleToggleMute = async (muted: boolean) => {
    const isOK = await confirm(
      muted ? "MUTE_GROUP_CONFIRM_TITLE" : "UNMUTE_GROUP_CONFIRM_TITLE",
      muted ? "MUTE_GROUP_CONFIRM_MESSAGE" : "UNMUTE_GROUP_CONFIRM_MESSAGE",
    )
    if (!isOK) return

    updateOption(
      { param: { groupId: id }, json: { notification: !muted } },
      {
        onSuccess() {
          refetchOption()
        },
      },
    )
  }

  const handleLeaveGroup = async () => {
    const isOK = await confirm(
      "LEAVE_GROUP_CONFIRM_TITLE",
      "LEAVE_GROUP_CONFIRM_MESSAGE",
    )
    if (!isOK) return

    leaveGroup(
      { param: { groupId: id } },
      {
        onSuccess() {
          refetchOption()
        },
      },
    )
  }

  const handleClearChat = async () => {
    const isOK = await confirm(
      "CLEAR_GROUP_CHAT_CONFIRM_TITLE",
      "CLEAR_GROUP_CHAT_CONFIRM_MESSAGE",
    )
    if (!isOK) return

    clearChat(
      { param: { groupId: id } },
      {
        onSuccess() {
          refetchOption()
          refetchRoom()
        },
      },
    )
  }

  const handleMenuClick = (action: ChatRoomGroupMenuAction) => {
    switch (action) {
      case "mute-group":
        handleToggleMute(true)
        break
      case "unmute-group":
        handleToggleMute(false)
        break
      case "leave-group":
        handleLeaveGroup()
        break
      case "delete-chat":
        handleClearChat()
        break
      default:
        break
    }
  }

  if (isNoMenu) {
    return null
  }

  const isActionLoading: Record<ChatRoomGroupMenuAction, boolean> = {
    "mute-group": isUpdatingOption,
    "unmute-group": isUpdatingOption,
    "leave-group": isLeavingGroup,
    "delete-chat": isClearingChat,
  }

  const isMenuShown: Record<ChatRoomGroupMenuAction, boolean> = {
    "mute-group": groupOption.notification,
    "unmute-group": !groupOption.notification,
    "leave-group": !!groupOption,
    "delete-chat": !!room,
  }

  const menuList = chatRoomGroupMenu.filter((menu) => {
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

export default ChatRoomMenuGroup
