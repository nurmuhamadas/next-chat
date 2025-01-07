import React from "react"

import { useQueryClient } from "@tanstack/react-query"
import { LoaderIcon, TrashIcon, UserIcon, UserXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import useBlockUser from "@/features/blocked-users/hooks/api/use-block-user"
import useGetIsUserBlocked from "@/features/blocked-users/hooks/api/use-get-is-user-blocked"
import useUnblockUser from "@/features/blocked-users/hooks/api/use-unblock-user"
import useClearPrivateChat from "@/features/private-chat/hooks/api/use-clear-private-chat"
import useGetUserProfileById from "@/features/user/hooks/api/use-get-profile-by-id"
import useConfirm from "@/hooks/use-confirm-dialog"
import { useRoomId } from "@/hooks/use-room-id"

import useGetPrivateChatOption from "../../../private-chat/hooks/api/use-get-private-chat-option"

const RoomProfilActionsPrivate = () => {
  const queryClient = useQueryClient()

  const id = useRoomId()

  const [Dialog, confirm] = useConfirm()

  const { mutate: blockUser, isPending: isBlocking } = useBlockUser()
  const { mutate: unblockUser, isPending: isUnblocking } = useUnblockUser()
  const { mutate: deleteChat, isPending: isDeleting } = useClearPrivateChat()

  const { data: user, isLoading: loadingUser } = useGetUserProfileById({ id })
  const { data: option, isLoading: isOptionLoading } = useGetPrivateChatOption({
    userId: id,
  })
  const { data: isBlocked, isLoading: loadingBlocked } = useGetIsUserBlocked({
    userId: id,
  })
  const isLoading = loadingUser || loadingBlocked || isOptionLoading
  const isNoAction = isLoading || !user
  const isNeverInteract = !isLoading && !option

  const handleBlockUser = async () => {
    const isOk = await confirm(
      "BLOCK_USER_CONFIM_TITLE",
      "BLOCK_USER_CONFIM_BODY",
    )
    if (!isOk) return

    blockUser(
      { blockedUserId: id },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["get-is-blocked-user", id],
          })
        },
      },
    )
  }

  const handleUnblockUser = async () => {
    const isOk = await confirm(
      "BLOCK_USER_CONFIM_TITLE",
      "BLOCK_USER_CONFIM_BODY",
    )
    if (!isOk) return

    unblockUser(
      { param: { blockedUserId: id } },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["get-is-blocked-user", id],
          })
        },
      },
    )
  }

  const handleDeleteChat = async () => {
    const isOk = await confirm(
      "DELETE_CHAT_CONFIM_TITLE",
      "DELETE_CHAT_CONFIM_BODY",
    )
    if (!isOk) return

    deleteChat(
      { param: { userId: id } },
      {
        onSuccess() {},
      },
    )
  }

  if (isNoAction) {
    return null
  }

  return (
    <>
      <div className="flex-wrap gap-x-2.5 py-8 flex-center">
        {!isBlocked ? (
          <Button
            variant="outline"
            onClick={handleBlockUser}
            disabled={isBlocking}
          >
            {isBlocking ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <UserXIcon className="size-4" />
            )}
            {isBlocking ? "Blocking user" : "Block user"}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handleUnblockUser}
            disabled={isUnblocking}
          >
            {isUnblocking ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <UserIcon className="size-4" />
            )}
            {isUnblocking ? "Unblocking user" : "Unblock user"}
          </Button>
        )}
        {!isNeverInteract && (
          <Button
            variant="outline"
            className="border-error text-error hover:text-error"
            onClick={handleDeleteChat}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <TrashIcon className="size-4" />
            )}
            {isDeleting ? "Deleting chat" : "Delete chat"}
          </Button>
        )}
      </div>
      <Dialog />
    </>
  )
}

export default RoomProfilActionsPrivate
