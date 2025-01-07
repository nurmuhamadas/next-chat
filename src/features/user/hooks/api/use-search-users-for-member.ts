import { useInfiniteQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useSearchUsersForMember = ({
  queryKey,
  limit = 20,
  groupId = "",
}: {
  queryKey?: string
  limit?: number
  groupId?: string
}) => {
  const query = useInfiniteQuery({
    queryKey: ["search-users-for-member", queryKey, limit],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await api.users.searchForMember(groupId, {
        query: queryKey,
        limit,
        cursor: pageParam,
      })

      return response
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
