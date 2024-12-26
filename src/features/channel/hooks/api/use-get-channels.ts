import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetChannels = ({
  queryKey,
  limit,
  cursor,
}: {
  queryKey?: string
  limit?: string
  cursor?: string
}) => {
  const query = useQuery({
    queryKey: ["get-channels", queryKey, limit, cursor],
    queryFn: async () => {
      const response = await client.api.channels.$get({
        query: { query: queryKey, limit, cursor },
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

export default useGetChannels
