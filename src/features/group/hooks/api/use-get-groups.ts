import { useInfiniteQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetGroups = ({
  queryKey,
  limit,
  enabled = true,
}: {
  queryKey?: string
  limit?: string
  enabled?: boolean
}) => {
  const query = useInfiniteQuery({
    queryKey: ["get-groups", queryKey, limit],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await client.api.groups.$get({
        query: { query: queryKey, limit, cursor: pageParam },
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    enabled,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
  })

  const data = query.data
    ? query.data.pages.reduce<Group[]>(
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

export default useGetGroups
