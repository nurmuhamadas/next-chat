import { parseAsBoolean, useQueryState } from "nuqs"

export const useChannelAdminsPanel = () => {
  const [isChannelAdminsOpen, setChannelAdmins] = useQueryState<boolean>(
    "channel-admins-open",
    parseAsBoolean.withDefault(false),
  )

  const openChannelAdmins = () => setChannelAdmins(true)
  const closeChannelAdmins = () => setChannelAdmins(false)

  return {
    isChannelAdminsOpen,
    openChannelAdmins,
    closeChannelAdmins,
  }
}
