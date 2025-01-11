import { useInfiniteQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useSearchChannels = ({
  queryKey,
  limit = 20,
}: {
  queryKey?: string
  limit?: number
}) => {
  const query = useInfiniteQuery({
    queryKey: ["search-channels", queryKey, limit],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await api.channels.searchPublicChannels({
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
