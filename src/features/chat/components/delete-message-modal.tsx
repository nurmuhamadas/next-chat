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
import { useScopedI18n } from "@/lib/locale/client"

import { useDeletedMessageId } from "../hooks/use-deleted-message-id"

interface DeleteMessageModalProps {
  message?: Message
  isAdmin: boolean
}
const DeleteMessageModal = ({ message, isAdmin }: DeleteMessageModalProps) => {
  const t = useScopedI18n("messages.delete")

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
      { messageId: message.id },
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
      { messageId: message.id },
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
      { messageId: message.id },
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
          <DialogTitle>{t("confirm_title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{t("confirm_body")}</DialogDescription>
        <DialogFooter>
          {message.isSender && (
            <div className="flex flex-col items-end">
              <Button
                variant="ghost"
                className="text-error hover:text-error"
                onClick={handleDeleteForAll}
                disabled={isDeletingForAll}
              >
                {t("for_all")}
              </Button>
              <Button
                variant="ghost"
                className="text-error hover:text-error"
                onClick={handleDeleteForMe}
                disabled={isDeletingForMe}
              >
                {t("for_me")}
              </Button>
              <Button variant="ghost" onClick={cancelDeleteMessage}>
                {t("cancel")}
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
                {t("default")}
              </Button>
              <Button variant="ghost" onClick={cancelDeleteMessage}>
                {t("for_all")}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteMessageModal
