import React from "react"

import { useQueryClient } from "@tanstack/react-query"
import { LoaderIcon, LogOutIcon, TrashIcon, UserXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import useDeleteChannelChat from "@/features/channel/hooks/api/use-delete-channel-chat"
import useGetChannelOption from "@/features/channel/hooks/api/use-get-channel-option"
import useLeaveChannel from "@/features/channel/hooks/api/use-leave-channel"
import useDeleteGroupChat from "@/features/group/hooks/api/use-delete-group-chat"
import useGetGroupOption from "@/features/group/hooks/api/use-get-group-option"
import useLeaveGroup from "@/features/group/hooks/api/use-leave-group"
import useConfirm from "@/hooks/use-confirm-dialog"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"

import useGetConversationOption from "../hooks/api/use-get-conversation-option"

const RoomProfilActions = () => {
  const queryClient = useQueryClient()

  const type = useRoomType()
  const id = useRoomId()

  const [Dialog, confirm] = useConfirm()

  const { mutate: leaveGroup, isPending: isLeavingGroup } = useLeaveGroup()
  const { mutate: leaveChannel, isPending: isLeavingChannel } =
    useLeaveChannel()

  const { mutate: deleteGroup, isPending: isDeletingGroup } =
    useDeleteGroupChat()
  const { mutate: deleteChannel, isPending: isDeletingChannel } =
    useDeleteChannelChat()

  const { data: convOption, isLoading: convLoading } = useGetConversationOption(
    {
      id: type === "chat" ? id : undefined,
    },
  )
  const { data: groupOption, isLoading: gOptLoading } = useGetGroupOption({
    id: type === "group" ? id : undefined,
  })
  const { data: channelOption, isLoading: cOptLoading } = useGetChannelOption({
    id: type === "channel" ? id : undefined,
  })
  const isOptionLoading = gOptLoading || cOptLoading || convLoading
  const isNoOption =
    !isOptionLoading && !convOption && !groupOption && !channelOption

  const handleLeaveGroup = async () => {
    const isOK = await confirm(
      "LEAVE_GROUP_CONFIM_TITLE",
      "LEAVE_GROUP_CONFIM_BODY",
    )
    if (!isOK) return

    leaveGroup(
      { param: { groupId: id } },
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["get-group-option", id] })
          queryClient.invalidateQueries({
            queryKey: ["get-is-group-member", id],
          })
        },
      },
    )
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

  const handleDeleteAndLeaveGroup = async () => {
    const isOK = await confirm(
      "DELETE_CHAT_GROUP_CONFIM_TITLE",
      "DELETE_CHAT_GROUP_CONFIM_BODY",
    )
    if (!isOK) return

    deleteGroup(
      { param: { groupId: id } },
      {
        onSuccess() {},
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

  if (isOptionLoading || isNoOption) {
    return null
  }

  return (
    <>
      <div className="flex-wrap gap-x-2.5 py-8 flex-center">
        {type === "chat" && (
          <>
            <Button variant="outline">
              <UserXIcon className="size-4" />
              Block user
            </Button>
            <Button
              variant="outline"
              className="border-error text-error hover:text-error"
            >
              <TrashIcon className="size-4" />
              Delete chat
            </Button>
          </>
        )}
        {type === "group" && (
          <>
            <Button
              variant="outline"
              disabled={isLeavingGroup}
              onClick={handleLeaveGroup}
            >
              {isLeavingGroup ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <LogOutIcon className="size-4" />
              )}
              {isLeavingGroup ? "Leaving" : "Leave"} group
            </Button>
            <Button
              variant="outline"
              className="border-error text-error hover:text-error"
              disabled={isDeletingGroup}
              onClick={handleDeleteAndLeaveGroup}
            >
              {isDeletingGroup ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <TrashIcon className="size-4" />
              )}{" "}
              {isDeletingGroup ? "Deleting chat" : "Delete chat"}
            </Button>
          </>
        )}
        {type === "channel" && (
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
        )}
      </div>
      <Dialog />
    </>
  )
}

export default RoomProfilActions
