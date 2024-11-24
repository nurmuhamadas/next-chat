import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"

export const useSelectedMessageIds = () => {
  const [selectedMessageIds, setSelectedMessageIds] = useQueryState<string[]>(
    "selected-message-ids",
    parseAsArrayOf(parseAsString).withDefault([]),
  )

  const toggleSelectMessage = (id: string) => {
    setSelectedMessageIds((prev) => {
      if (prev?.includes(id)) {
        return prev.filter((prevId) => prevId !== id)
      }

      return [...prev, id]
    })
  }

  const cancelSelectMessage = () => setSelectedMessageIds([])

  return {
    isSelectMode: selectedMessageIds.length > 0,
    selectedMessageIds,
    toggleSelectMessage,
    cancelSelectMessage,
  }
}
