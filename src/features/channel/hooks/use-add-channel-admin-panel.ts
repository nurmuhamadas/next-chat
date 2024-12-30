import { parseAsBoolean, useQueryState } from "nuqs"

export const useAddChannelAdminPanel = () => {
  const [isAddChannelAdminOpen, setAddChannelAdmin] = useQueryState<boolean>(
    "add-channel-admin",
    parseAsBoolean.withDefault(false),
  )

  const openAddChannelAdmin = () => setAddChannelAdmin(true)
  const closeAddChannelAdmin = () => setAddChannelAdmin(false)

  return {
    isAddChannelAdminOpen,
    openAddChannelAdmin,
    closeAddChannelAdmin,
  }
}
