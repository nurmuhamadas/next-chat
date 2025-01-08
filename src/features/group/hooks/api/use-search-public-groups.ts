import { useInfiniteQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useSearchPublicGroups = ({
  queryKey,
  limit = 20,
}: {
  queryKey?: string
  limit?: number
}) => {
  const query = useInfiniteQuery({
    queryKey: ["search-public-groups", queryKey, limit],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await api.groups.searchPublicGroups({
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
    ? query.data.pages.reduce<GroupSearch[]>(
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

export default useSearchPublicGroups
