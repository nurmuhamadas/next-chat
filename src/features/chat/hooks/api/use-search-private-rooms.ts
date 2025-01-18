import { useInfiniteQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useSearchPrivateRooms = ({
  queryKey,
  limit = 20,
  enabled = true,
}: {
  queryKey?: string
  limit?: number
  enabled?: boolean
}) => {
  const query = useInfiniteQuery({
    queryKey: ["search-private-rooms", limit, queryKey],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await api.rooms.getPrivateRooms({
        cursor: pageParam,
        limit,
        query: queryKey,
      })

      return response
    },
    enabled,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
  })

  const data = query.data
    ? query.data.pages.reduce<PrivateRoom[]>(
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
