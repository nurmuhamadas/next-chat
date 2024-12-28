import { useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import useDeleteMessageByAdmin from "@/features/messages/hooks/api/use-delete-message-by-admin"
import useDeleteMessageForAll from "@/features/messages/hooks/api/use-delete-message-for-all"
import useDeleteMessageForMe from "@/features/messages/hooks/api/use-delete-message-for-me"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"

import { useDeletedMessageId } from "../hooks/use-deleted-message-id"

interface DeleteMessageModalProps {
  message?: Message
  isAdmin: boolean
}
const DeleteMessageModal = ({ message, isAdmin }: DeleteMessageModalProps) => {
  const queryClient = useQueryClient()

  const id = useRoomId()
  const type = useRoomType()

  const { deletedMessageId, cancelDeleteMessage } = useDeletedMessageId()

  const { mutate: deleteForAll, isPending: isDeletingForAll } =
    useDeleteMessageForAll()
  const { mutate: deleteForMe, isPending: isDeletingForMe } =
    useDeleteMessageForMe()
  const { mutate: deleteByAdmin, isPending: isDeletingByAdmin } =
    useDeleteMessageByAdmin()

  if (!message) {
    return null
  }

  const handleDeleteForAll = () => {
    deleteForAll(
      { param: { messageId: message.id } },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["get-messages", id, type],
          })
          cancelDeleteMessage()
        },
      },
    )
  }

  const handleDeleteForMe = () => {
    deleteForMe(
      { param: { messageId: message.id } },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["get-messages", id, type],
          })
          cancelDeleteMessage()
        },
      },
    )
  }

  const handleDeleteByAdmin = () => {
    deleteByAdmin(
      { param: { messageId: message.id } },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["get-messages", id, type],
          })
          cancelDeleteMessage()
        },
      },
    )
  }

  return (
    <Dialog open={!!deletedMessageId} onOpenChange={cancelDeleteMessage}>
      <DialogContent hideCloseButton className="max-w-[450px]">
        <DialogHeader>
          <DialogTitle>DELETE_MESSAGE_TITLE</DialogTitle>
        </DialogHeader>
        <DialogDescription>DELETE_MESSAGE_BODY</DialogDescription>
        <DialogFooter>
          {message.isSender && (
            <div className="flex flex-col items-end">
              <Button
                variant="ghost"
                className="text-error hover:text-error"
                onClick={handleDeleteForAll}
                disabled={isDeletingForAll}
              >
                {isDeletingForAll ? "Deleting " : "Delete "}
                for everyone
              </Button>
              <Button
                variant="ghost"
                className="text-error hover:text-error"
                onClick={handleDeleteForMe}
                disabled={isDeletingForMe}
              >
                {isDeletingForMe ? "Deleting " : "Delete "}
                just for me
              </Button>
              <Button variant="ghost" onClick={cancelDeleteMessage}>
                Cancel
              </Button>
            </div>
          )}
          {!message.isSender && isAdmin && (
            <div className="flex">
              <Button
                variant="ghost"
                className="text-error hover:text-error"
                onClick={handleDeleteByAdmin}
                disabled={isDeletingByAdmin}
              >
                {isDeletingByAdmin ? "Deleting" : "Delete"}
              </Button>
              <Button variant="ghost" onClick={cancelDeleteMessage}>
                Cancel
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteMessageModal
