import { parseAsString, useQueryState } from "nuqs"

export const useEditChannelModal = () => {
  const [channelId, setChannelId] = useQueryState<string>(
    "edit-channel",
    parseAsString.withDefault("").withOptions({
      clearOnDefault: true,
    }),
  )

  const openEditChannel = (id: string) => setChannelId(id)
  const closeEditChannel = () => setChannelId(null)

  const isEditChannelOpen = !!channelId

  return {
    isEditChannelOpen,
    channelId,
    openEditChannel,
    closeEditChannel,
  }
}
