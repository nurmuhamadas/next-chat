import { parseAsBoolean, useQueryState } from "nuqs"

export const useGroupAdminsPanel = () => {
  const [isGroupAdminsOpen, setGroupAdmins] = useQueryState<boolean>(
    "group-admins-open",
    parseAsBoolean.withDefault(false),
  )

  const openGroupAdmins = () => setGroupAdmins(true)
  const closeGroupAdmins = () => setGroupAdmins(false)

  return {
    isGroupAdminsOpen,
    openGroupAdmins,
    closeGroupAdmins,
  }
}
