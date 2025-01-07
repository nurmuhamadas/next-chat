import { useInfiniteQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useGetBlockedUsers = ({
  limit = 20,
  enabled = true,
}: {
  limit?: number
  enabled?: boolean
}) => {
  const query = useInfiniteQuery({
    queryKey: ["get-blocked-users", limit],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await api.blockedUsers.get({ cursor: pageParam, limit })

      return response
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
