import { parseAsString, useQueryState } from "nuqs"

export const useDeletedMessageId = () => {
  const [deletedMessageId, setDeletedMessageId] = useQueryState<string>(
    "deleted-message-id",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  )

  const deleteMessage = (id: string) => setDeletedMessageId(id)
  const cancelDeleteMessage = () => setDeletedMessageId(null)

  return {
    deletedMessageId,
    deleteMessage,
    cancelDeleteMessage,
  }
}
