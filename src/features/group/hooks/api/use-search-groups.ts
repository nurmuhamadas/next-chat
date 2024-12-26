import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useSearchGroups = ({
  queryKey,
  limit,
  cursor,
}: {
  queryKey?: string
  limit?: string
  cursor?: string
}) => {
  const query = useQuery({
    queryKey: ["search-groups", queryKey, limit, cursor],
    queryFn: async () => {
      const response = await client.api.groups.search.$get({
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

export default useSearchGroups
