import { useInfiniteQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useSearchUsers = ({
  queryKey,
  limit,
}: {
  queryKey?: string
  limit?: string
}) => {
  const query = useInfiniteQuery({
    queryKey: ["search-users", queryKey, limit],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await client.api.users.search.$get({
        query: { query: queryKey, limit, cursor: pageParam },
      })

      const result = await response.json()

      return result
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
