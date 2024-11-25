import { parseAsString, useQueryState } from "nuqs"

export const useForwardMessage = () => {
  const [forwardMessageId, setForwardMessageId] = useQueryState<string>(
    "forward-message",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  )

  const forwardMessage = (id: string) => setForwardMessageId(id)
  const cancelForwardMessage = () => setForwardMessageId(null)

  return {
    isForwardModalOpen: !!forwardMessageId,
    forwardMessageId,
    forwardMessage,
    cancelForwardMessage,
  }
}
