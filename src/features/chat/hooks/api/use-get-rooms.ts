import { useInfiniteQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useGetRooms = ({ limit = 20 }: { limit?: number }) => {
  const query = useInfiniteQuery({
    queryKey: ["rooms", limit],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await api.rooms.get({ cursor: pageParam, limit })

      return response
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
  })

  const data = query.data
    ? query.data.pages.reduce<Room[]>((acc, curr) => [...acc, ...curr.data], [])
    : []

  return {
    ...query,
    data,
    pages: query.data ? query.data.pages : [],
    pageParams: query.data ? query.data.pageParams : [],
  }
}

export default useGetRooms
