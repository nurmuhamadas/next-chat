import { parseAsBoolean, useQueryState } from "nuqs"

export const useEditMyProfilePanel = () => {
  const [isEditMyProfileOpen, setEditMyProfileOpen] = useQueryState<boolean>(
    "edit-my-profile",
    parseAsBoolean.withDefault(false),
  )

  const openEditMyProfile = () => setEditMyProfileOpen(true)
  const closeEditMyProfile = () => setEditMyProfileOpen(false)

  return {
    isEditMyProfileOpen,
    openEditMyProfile,
    closeEditMyProfile,
  }
}
