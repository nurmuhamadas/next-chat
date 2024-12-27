import { parseAsString, useQueryState } from "nuqs"

export const useSearchQuery = () => {
  const [searchQuery, setSearchQuery] = useQueryState<string>(
    "search-query",
    parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  )

  return {
    searchQuery: searchQuery === "" ? undefined : searchQuery,
    setSearchQuery,
  }
}
