import { parseAsBoolean, useQueryState } from "nuqs"

export const useBlockedUsersPanel = () => {
  const [isBlockedUsersOpen, setBlockedUsersOpen] = useQueryState<boolean>(
    "show-blocked-users",
    parseAsBoolean.withDefault(false),
  )

  const openBlockedUsers = () => setBlockedUsersOpen(true)
  const closeBlockedUsers = () => setBlockedUsersOpen(false)

  return {
    isBlockedUsersOpen,
    openBlockedUsers,
    closeBlockedUsers,
  }
}
