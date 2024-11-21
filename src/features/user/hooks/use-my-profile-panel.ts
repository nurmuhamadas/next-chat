import { parseAsBoolean, useQueryState } from "nuqs"

export const useMyProfilePanel = () => {
  const [isMyProfileOpen, setMyProfileOpen] = useQueryState<boolean>(
    "show-my-profile",
    parseAsBoolean.withDefault(false),
  )

  const openMyProfile = () => setMyProfileOpen(true)
  const closeMyProfile = () => setMyProfileOpen(false)

  return {
    isMyProfileOpen,
    openMyProfile,
    closeMyProfile,
  }
}
