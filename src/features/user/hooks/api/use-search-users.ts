import { useInfiniteQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useSearchUsers = ({
  queryKey,
  limit = 20,
}: {
  queryKey?: string
  limit?: number
}) => {
  const query = useInfiniteQuery({
    queryKey: ["search-users", queryKey, limit],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await api.users.search({
        query: queryKey,
        limit,
        cursor: pageParam,
      })

      return response
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
  })

  const data = query.data
    ? query.data.pages.reduce<UserSearch[]>(
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

export default useSearchUsers
