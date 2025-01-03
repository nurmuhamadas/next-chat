import { useInfiniteQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useSearchPrivateRooms = ({
  queryKey,
  limit,
  enabled = true,
}: {
  queryKey?: string
  limit?: string
  enabled?: boolean
}) => {
  const query = useInfiniteQuery({
    queryKey: ["search-private-rooms", limit, queryKey],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await client.api.rooms["search-private"].$get({
        query: { cursor: pageParam, limit, query: queryKey },
      })

      const result = await response.json()

      return result
    },
    enabled,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
  })

  const data = query.data
    ? query.data.pages.reduce<UserSearch[]>(
        (acc, curr) => [...acc, ...curr.data],
        [],
      )
    : []

  return {
    ...query,
    data,
    pages: query.data ? query.data.pages : [],
    pageParams: query.data ? query.data.pageParams : [],
  }
}

export default useSearchPrivateRooms
