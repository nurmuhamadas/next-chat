import { parseAsBoolean, useQueryState } from "nuqs"

export const useAddGroupMemberPanel = () => {
  const [isAddGroupMemberOpen, serAddGroupMember] = useQueryState<boolean>(
    "add-group-member",
    parseAsBoolean.withDefault(false),
  )

  const openAddGroupMember = () => serAddGroupMember(true)
  const closeAddGroupMember = () => serAddGroupMember(false)

  return {
    isAddGroupMemberOpen,
    openAddGroupMember,
    closeAddGroupMember,
  }
}
