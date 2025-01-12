import React from "react"

import { useRouter } from "next/navigation"

import { useQueryClient } from "@tanstack/react-query"
import { LoaderIcon, LogOutIcon, TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import useDeleteGroupChat from "@/features/group/hooks/api/use-delete-group-chat"
import useGetGroupById from "@/features/group/hooks/api/use-get-group-by-id"
import useGetGroupOption from "@/features/group/hooks/api/use-get-group-option"
import useJoinGroup from "@/features/group/hooks/api/use-join-group"
import useLeaveGroup from "@/features/group/hooks/api/use-leave-group"
import useConfirm from "@/hooks/use-confirm-dialog"
import { useRoomId } from "@/hooks/use-room-id"

import useDeleteRoom from "../../hooks/api/use-delete-room"
import useGetRoom from "../../hooks/api/use-get-room"

const RoomProfilActionsGroup = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const id = useRoomId()

  const [Dialog, confirm] = useConfirm()

  const { mutate: joinGroup, isPending: joiningGroup } = useJoinGroup()
  const { mutate: leaveGroup, isPending: isLeavingGroup } = useLeaveGroup()
  const { mutate: deleteGroupChat, isPending: isClearingChat } =
    useDeleteGroupChat()
  const { mutate: deleteRoom, isPending: isDeletingGroup } = useDeleteRoom()

  const { data: room, isLoading: roomLoading } = useGetRoom({ id })
  const { data: group, isLoading: groupLoading } = useGetGroupById({ id })
  const { data: groupOption, isLoading: isOptionLoading } = useGetGroupOption({
    groupId: id,
  })
  const isLoading = isOptionLoading || groupLoading || roomLoading
  const isNoAction = isLoading || !group
  const isNotMember = !isLoading && !groupOption

  const handleJoinGroup = () => {
    if (group) {
      joinGroup(
        { data: { code: group.inviteCode }, groupId: id },
        {
          onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["rooms"] })
            queryClient.invalidateQueries({ queryKey: ["room", id] })
            queryClient.invalidateQueries({
              queryKey: ["get-group-members", id],
            })
            queryClient.invalidateQueries({
              queryKey: ["get-group-by-id", id],
            })
            queryClient.invalidateQueries({
              queryKey: ["get-group-option", id],
            })
          },
        },
      )
    }
  }

  const handleLeaveGroup = async () => {
    const isOK = await confirm(
      "LEAVE_GROUP_CONFIM_TITLE",
      "LEAVE_GROUP_CONFIM_BODY",
    )
    if (!isOK) return

    leaveGroup(
      { groupId: id },
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["get-group-option", id] })
          queryClient.invalidateQueries({
            queryKey: ["get-group-members", id],
          })
          queryClient.invalidateQueries({
            queryKey: ["get-group-by-id", id],
          })
        },
      },
    )
  }

  const handleDeleteGroupChat = async () => {
    const isOK = await confirm(
      "DELETE_GROUP_CHAT_CONFIM_TITLE",
      "DELETE_GROUP_CHAT_CONFIM_BODY",
    )
    if (!isOK) return

    deleteGroupChat(
      { groupId: id },
      {
        onSuccess() {},
      },
    )
  }

  const handleDeleteGroup = async () => {
    const isOK = await confirm(
      "DELETE_GROUP_CONFIM_TITLE",
      "DELETE_GROUP_CONFIM_BODY",
    )
    if (!isOK) return

    deleteRoom(
      { roomId: id },
      {
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["rooms"] })
          queryClient.invalidateQueries({ queryKey: ["room", id] })
          queryClient.invalidateQueries({
            queryKey: ["get-group-by-id", id],
          })
          queryClient.invalidateQueries({
            queryKey: ["get-group-option", id],
          })

          router.push("/")
        },
      },
    )
  }

  if (isNoAction) {
    return null
  }

  return (
    <>
      <div className="flex-wrap gap-x-2.5 py-8 flex-center">
        {!isNotMember ? (
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
              disabled={isClearingChat}
              onClick={handleDeleteGroupChat}
            >
              {isClearingChat ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <TrashIcon className="size-4" />
              )}{" "}
              {isClearingChat ? "Clearing chat" : "Clear chat"}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              disabled={joiningGroup}
              onClick={handleJoinGroup}
            >
              {joiningGroup && <LoaderIcon className="animate-spin" />}
              {joiningGroup ? "Joining" : "Join"} group
            </Button>
            {room && (
              <Button
                variant="outline"
                className="border-error text-error hover:text-error"
                disabled={isDeletingGroup}
                onClick={handleDeleteGroup}
              >
                {isDeletingGroup ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  <TrashIcon className="size-4" />
                )}{" "}
                {isDeletingGroup ? "Deleting" : "Delete"} group
              </Button>
            )}
          </>
        )}
      </div>
      <Dialog />
    </>
  )
}

export default RoomProfilActionsGroup
