import { parseAsString, useQueryState } from "nuqs"

export const useEditedMessageId = () => {
  const [editedMessageId, setEditedMessageId] = useQueryState<string>(
    "edited-message-id",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  )

  const editMessage = (id: string) => setEditedMessageId(id)
  const cancelEditMessage = () => setEditedMessageId(null)

  return {
    editedMessageId,
    editMessage,
    cancelEditMessage,
  }
}
