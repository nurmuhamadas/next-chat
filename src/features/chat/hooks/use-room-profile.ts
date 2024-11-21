import { parseAsBoolean, useQueryState } from "nuqs"

export const useRoomProfile = () => {
  const [roomProfileOpen, setRoomProfileOpen] = useQueryState<boolean>(
    "show-room-profile",
    parseAsBoolean.withDefault(false),
  )

  const openRoomProfile = () => setRoomProfileOpen(true)
  const closeRoomProfile = () => setRoomProfileOpen(false)

  return {
    roomProfileOpen,
    openRoomProfile,
    closeRoomProfile,
  }
}
