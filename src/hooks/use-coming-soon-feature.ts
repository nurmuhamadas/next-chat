import { parseAsBoolean, useQueryState } from "nuqs"

export const useComingSoonFeature = () => {
  const [comingSoonInfoOpen, setComingSoonInfoOpen] = useQueryState<boolean>(
    "show-coming-soon-info",
    parseAsBoolean.withDefault(false),
  )

  const openComingSoonInfo = () => setComingSoonInfoOpen(true)
  const closeComingSoonInfo = () => setComingSoonInfoOpen(false)

  return {
    comingSoonInfoOpen,
    openComingSoonInfo,
    closeComingSoonInfo,
  }
}
