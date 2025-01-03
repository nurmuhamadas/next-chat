import { useInfiniteQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useSearchUsersForMember = ({
  queryKey,
  limit,
  groupId = "",
}: {
  queryKey?: string
  limit?: string
  groupId?: string
}) => {
  const query = useInfiniteQuery({
    queryKey: ["search-users-for-member", queryKey, limit],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await client.api.users["search-for-member"][
        ":groupId"
      ].$get({
        query: { query: queryKey, limit, cursor: pageParam },
        param: { groupId },
      })

      const result = await response.json()

      return result
    },
    enabled: !!groupId,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
  })

  const data = query.data
    ? query.data.pages.reduce<UserSearchForMember[]>(
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

export default useSearchUsersForMember
