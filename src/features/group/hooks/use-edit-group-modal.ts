import { parseAsString, useQueryState } from "nuqs"

export const useEditGroupModal = () => {
  const [groupId, setGroupId] = useQueryState<string>(
    "edit-group",
    parseAsString.withDefault("").withOptions({
      clearOnDefault: true,
    }),
  )

  const openEditGroup = (id: string) => setGroupId(id)
  const closeEditGroup = () => setGroupId(null)

  const isEditGroupOpen = !!groupId

  return {
    isEditGroupOpen,
    groupId,
    openEditGroup,
    closeEditGroup,
  }
}
