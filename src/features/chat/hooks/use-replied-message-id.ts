import { parseAsString, useQueryState } from "nuqs"

export const useRepliedMessageId = () => {
  const [repliedMessageId, setRepliedMessageId] = useQueryState<string>(
    "replied-message-id",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  )

  const replyMessage = (id: string) => setRepliedMessageId(id)
  const cancelReplyMessage = () => setRepliedMessageId(null)

  return {
    repliedMessageId,
    replyMessage,
    cancelReplyMessage,
  }
}
