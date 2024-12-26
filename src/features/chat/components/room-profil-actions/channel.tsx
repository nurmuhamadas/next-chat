import React from "react"

import { useQueryClient } from "@tanstack/react-query"
import { LoaderIcon, LogOutIcon, TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import useDeleteChannelChat from "@/features/channel/hooks/api/use-delete-channel-chat"
import useGetChannelById from "@/features/channel/hooks/api/use-get-channel-by-id"
import useGetChannelOption from "@/features/channel/hooks/api/use-get-channel-option"
import useJoinChannel from "@/features/channel/hooks/api/use-join-channel"
import useLeaveChannel from "@/features/channel/hooks/api/use-leave-channel"
import useConfirm from "@/hooks/use-confirm-dialog"
import { useRoomId } from "@/hooks/use-room-id"

const RoomProfilActionsChannel = () => {
  const queryClient = useQueryClient()

  const id = useRoomId()

  const [Dialog, confirm] = useConfirm()

  const { mutate: joinChannel, isPending: joiningChannel } = useJoinChannel()
  const { mutate: leaveChannel, isPending: isLeavingChannel } =
    useLeaveChannel()
  const { mutate: deleteChannel, isPending: isDeletingChannel } =
    useDeleteChannelChat()

  const { data: channel } = useGetChannelById({ id })
  const { data: channelOption, isLoading: isOptionLoading } =
    useGetChannelOption({ channelId: id })
  const isNoOption = !isOptionLoading && !channelOption

  const handleSubsChannel = () => {
    if (channel) {
      joinChannel(
        { json: { code: channel.inviteCode }, param: { channelId: id } },
        {
          onSuccess() {
            queryClient.invalidateQueries({
              queryKey: ["rooms"],
            })
            queryClient.invalidateQueries({
              queryKey: ["room", id],
            })
            queryClient.invalidateQueries({
              queryKey: ["get-is-channel-subs", id],
            })
            queryClient.invalidateQueries({
              queryKey: ["get-channel-option", id],
            })
          },
        },
      )
    }
  }

  const handleLeaveChannel = async () => {
    const isOK = await confirm(
      "LEAVE_CHANNEL_CONFIM_TITLE",
      "LEAVE_CHANNEL_CONFIM_BODY",
    )
    if (!isOK) return

    leaveChannel(
      { param: { channelId: id } },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["get-channel-option", id],
          })
          queryClient.invalidateQueries({
            queryKey: ["get-is-channel-subs", id],
          })
        },
      },
    )
  }

  const handleDeleteAndLeaveChannel = async () => {
    const isOK = await confirm(
      "DELETE_CHAT_CHANNEL_CONFIM_TITLE",
      "DELETE_CHAT_CHANNEL_CONFIM_BODY",
    )
    if (!isOK) return

    deleteChannel(
      { param: { channelId: id } },
      {
        onSuccess() {},
      },
    )
  }

  if (isOptionLoading) {
    return null
  }

  return (
    <>
      <div className="flex-wrap gap-x-2.5 py-8 flex-center">
        {!isNoOption ? (
          <>
            <Button
              variant="outline"
              disabled={isLeavingChannel}
              onClick={handleLeaveChannel}
            >
              {isLeavingChannel ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <LogOutIcon className="size-4" />
              )}
              {isLeavingChannel ? "Leaving" : "Leave"} channel
            </Button>
            <Button
              variant="outline"
              className="border-error text-error hover:text-error"
              disabled={isDeletingChannel}
              onClick={handleDeleteAndLeaveChannel}
            >
              {isDeletingChannel ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <TrashIcon className="size-4" />
              )}{" "}
              {isDeletingChannel ? "Deleting chat" : "Delete chat"}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              disabled={joiningChannel}
              onClick={handleSubsChannel}
            >
              {joiningChannel && <LoaderIcon className="animate-spin" />}
              {joiningChannel ? "Subscribing" : "Subscribe"} channel
            </Button>
          </>
        )}
      </div>
      <Dialog />
    </>
  )
}

export default RoomProfilActionsChannel
