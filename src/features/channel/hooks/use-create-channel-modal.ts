import { parseAsBoolean, useQueryState } from "nuqs"

export const useCreateChannelModal = () => {
  const [isCreateChannelOpen, setCreateChannelOpen] = useQueryState<boolean>(
    "create-channel",
    parseAsBoolean.withDefault(false),
  )

  const openCreateChannel = () => setCreateChannelOpen(true)
  const closeCreateChannel = () => setCreateChannelOpen(false)

  return {
    isCreateChannelOpen,
    openCreateChannel,
    closeCreateChannel,
  }
}
