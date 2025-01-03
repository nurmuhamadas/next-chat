import { useInfiniteQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetRooms = ({ limit }: { limit?: string }) => {
  const query = useInfiniteQuery({
    queryKey: ["rooms"],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await client.api.rooms.$get({
        query: { cursor: pageParam, limit },
      })

      const result = await response.json()

      return result
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
