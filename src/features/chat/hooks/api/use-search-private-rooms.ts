import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useSearchPrivateRooms = ({
  queryKey,
  limit,
  cursor,
}: {
  queryKey?: string
  limit?: string
  cursor?: string
}) => {
  const query = useQuery({
    queryKey: ["rooms", cursor, limit, queryKey],
    queryFn: async () => {
      const response = await client.api.rooms["search-private"].$get({
        query: { cursor, limit, query: queryKey },
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
  })

  return {
    ...query,
    data: query.data?.data ?? [],
    total: query.data?.total,
    cursor: query.data?.cursor,
  }
}

export default useSearchPrivateRooms
