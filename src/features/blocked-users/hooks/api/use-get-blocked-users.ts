import { useInfiniteQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetBlockedUsers = ({
  limit,
  enabled = true,
}: {
  limit?: string
  enabled?: boolean
}) => {
  const query = useInfiniteQuery({
    queryKey: ["get-blocked-users", limit],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await client.api["blocked-users"].$get({
        query: { cursor: pageParam, limit },
      })

      const result = await response.json()

      return result
    },
    enabled,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
  })

  const data = query.data
    ? query.data.pages.reduce<BlockedUser[]>(
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

export default useGetBlockedUsers
