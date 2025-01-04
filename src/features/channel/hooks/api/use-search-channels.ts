import { useInfiniteQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useSearchChannels = ({
  queryKey,
  limit,
}: {
  queryKey?: string
  limit?: string
}) => {
  const query = useInfiniteQuery({
    queryKey: ["search-channels", queryKey, limit],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await client.api.channels.search.$get({
        query: { query: queryKey, limit, cursor: pageParam },
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
  })

  const data = query.data
    ? query.data.pages.reduce<ChannelSearch[]>(
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

export default useSearchChannels
