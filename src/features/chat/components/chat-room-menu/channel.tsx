"use client"

import { LoaderIcon, MoreVerticalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useDeleteChannelChat from "@/features/channel/hooks/api/use-delete-channel-chat"
import useGetChannelOption from "@/features/channel/hooks/api/use-get-channel-option"
import useLeaveChannel from "@/features/channel/hooks/api/use-leave-channel"
import useUpdateChannelOption from "@/features/channel/hooks/api/use-update-channel-option"
import useConfirm from "@/hooks/use-confirm-dialog"
import { useRoomId } from "@/hooks/use-room-id"
import { cn } from "@/lib/utils"

import { chatRoomChannelMenu } from "../../constants"
import useGetRoom from "../../hooks/api/use-get-room"

const ChatRoomMenuChannel = () => {
  const id = useRoomId()

  const [Dialog, confirm] = useConfirm()

  const { mutate: updateOption, isPending: isUpdatingOption } =
    useUpdateChannelOption()
  const { mutate: leaveChannel, isPending: isLeavingChannel } =
    useLeaveChannel()
  const { mutate: clearChat, isPending: isClearingChat } =
    useDeleteChannelChat()

  const {
    data: channelOption,
    isLoading: channelOptionLoading,
    refetch: refetchOption,
  } = useGetChannelOption({ channelId: id })
  const {
    data: room,
    isLoading: loadingRoom,
    refetch: refetchRoom,
  } = useGetRoom({ id })

  const isLoading = channelOptionLoading || loadingRoom
  const isNoMenu = isLoading || !channelOption

  const handleToggleMute = async (muted: boolean) => {
    const isOK = await confirm(
      muted ? "MUTE_CHANNEL_CONFIRM_TITLE" : "UNMUTE_CHANNEL_CONFIRM_TITLE",
      muted ? "MUTE_CHANNEL_CONFIRM_MESSAGE" : "UNMUTE_CHANNEL_CONFIRM_MESSAGE",
    )
    if (!isOK) return

    updateOption(
      { param: { channelId: id }, json: { notification: !muted } },
      {
        onSuccess() {
          refetchOption()
        },
      },
    )
  }

  const handleLeaveChannel = async () => {
    const isOK = await confirm(
      "LEAVE_CHANNEL_CONFIRM_TITLE",
      "LEAVE_CHANNEL_CONFIRM_MESSAGE",
    )
    if (!isOK) return

    leaveChannel(
      { param: { channelId: id } },
      {
        onSuccess() {
          refetchOption()
        },
      },
    )
  }

  const handleClearChat = async () => {
    const isOK = await confirm(
      "CLEAR_CHANNEL_CHAT_CONFIRM_TITLE",
      "CLEAR_CHANNEL_CHAT_CONFIRM_MESSAGE",
    )
    if (!isOK) return

    clearChat(
      { param: { channelId: id } },
      {
        onSuccess() {
          refetchOption()
          refetchRoom()
        },
      },
    )
  }

  const handleMenuClick = (action: ChatRoomChannelMenuAction) => {
    switch (action) {
      case "mute-channel":
        handleToggleMute(true)
        break
      case "unmute-channel":
        handleToggleMute(false)
        break
      case "leave-channel":
        handleLeaveChannel()
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

  const isActionLoading: Record<ChatRoomChannelMenuAction, boolean> = {
    "mute-channel": isUpdatingOption,
    "unmute-channel": isUpdatingOption,
    "leave-channel": isLeavingChannel,
    "delete-chat": isClearingChat,
  }

  const isMenuShown: Record<ChatRoomChannelMenuAction, boolean> = {
    "mute-channel": channelOption.notification,
    "unmute-channel": !channelOption.notification,
    "leave-channel": !!channelOption,
    "delete-chat": !!room,
  }

  const menuList = chatRoomChannelMenu.filter((menu) => {
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

export default ChatRoomMenuChannel
