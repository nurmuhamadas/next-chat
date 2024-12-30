import { parseAsBoolean, useQueryState } from "nuqs"

export const useAddGroupAdminPanel = () => {
  const [isAddGroupAdminOpen, setAddGroupAdmin] = useQueryState<boolean>(
    "add-group-admin",
    parseAsBoolean.withDefault(false),
  )

  const openAddGroupAdmin = () => setAddGroupAdmin(true)
  const closeAddGroupAdmin = () => setAddGroupAdmin(false)

  return {
    isAddGroupAdminOpen,
    openAddGroupAdmin,
    closeAddGroupAdmin,
  }
}
