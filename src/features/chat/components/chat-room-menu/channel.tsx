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
import useDeleteChannelChat from "@/features/channel/hooks/api/use-delete-channel-chat"
import useGetChannelOption from "@/features/channel/hooks/api/use-get-channel-option"
import useLeaveChannel from "@/features/channel/hooks/api/use-leave-channel"
import useUpdateChannelOption from "@/features/channel/hooks/api/use-update-channel-option"
import useConfirm from "@/hooks/use-confirm-dialog"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"
import { useScopedI18n } from "@/lib/locale/client"
import { cn } from "@/lib/utils"

import { chatRoomChannelMenu } from "../../constants"
import useGetRoom from "../../hooks/api/use-get-room"

const ChatRoomMenuChannel = () => {
  const t = useScopedI18n("room_menu.channel")

  const queryClient = useQueryClient()

  const id = useRoomId()
  const type = useRoomType()

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
      muted ? t("confirm_mute.title") : t("confirm_unmute.title"),
      muted ? t("confirm_mute.message") : t("confirm_unmute.message"),
    )
    if (!isOK) return

    updateOption(
      { channelId: id, data: { notification: !muted } },
      {
        onSuccess() {
          refetchOption()
        },
      },
    )
  }

  const handleLeaveChannel = async () => {
    const isOK = await confirm(
      t("confirm_leave.title"),
      t("confirm_leave.message"),
    )
    if (!isOK) return

    leaveChannel(
      { channelId: id },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["get-channel-by-id", id],
          })
          refetchOption()
        },
      },
    )
  }

  const handleClearChat = async () => {
    const isOK = await confirm(
      t("confirm_delete.title"),
      t("confirm_delete.message"),
    )
    if (!isOK) return

    clearChat(
      { channelId: id },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["get-messages", id, type, 20],
          })
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

export default ChatRoomMenuChannel
