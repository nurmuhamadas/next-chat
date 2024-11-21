import { parseAsBoolean, useQueryState } from "nuqs"

export const useCreateGroupModal = () => {
  const [isCreateGroupOpen, setCreateGroupOpen] = useQueryState<boolean>(
    "create-group",
    parseAsBoolean.withDefault(false),
  )

  const openCreateGroup = () => setCreateGroupOpen(true)
  const closeCreateGroup = () => setCreateGroupOpen(false)

  return {
    isCreateGroupOpen,
    openCreateGroup,
    closeCreateGroup,
  }
}
