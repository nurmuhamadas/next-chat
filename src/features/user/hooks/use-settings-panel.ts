import { parseAsBoolean, useQueryState } from "nuqs"

export const useSettingsPanel = () => {
  const [isSettingsOpen, setSettingsOpen] = useQueryState<boolean>(
    "show-settings",
    parseAsBoolean.withDefault(false),
  )

  const openSettings = () => setSettingsOpen(true)
  const closeSettings = () => setSettingsOpen(false)

  return {
    isSettingsOpen,
    openSettings,
    closeSettings,
  }
}
