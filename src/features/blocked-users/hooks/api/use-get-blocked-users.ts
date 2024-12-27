import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetBlockedUsers = ({
  cursor,
  limit,
}: {
  limit?: string
  cursor?: string
}) => {
  const query = useQuery({
    queryKey: ["get-blocked-users", cursor, limit],
    queryFn: async () => {
      const response = await client.api["blocked-users"].$get({
        query: { cursor, limit },
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
    total: query.data?.total ?? 0,
    cursor: query.data?.cursor,
  }
}

export default useGetBlockedUsers
