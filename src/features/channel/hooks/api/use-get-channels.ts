import { useInfiniteQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useGetChannels = ({
  queryKey,
  limit = 20,
  enabled = true,
}: {
  queryKey?: string
  limit?: number
  enabled?: boolean
}) => {
  const query = useInfiniteQuery({
    queryKey: ["get-channels", queryKey, limit],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await api.channels.get({
        query: queryKey,
        limit,
        cursor: pageParam,
      })

      return response
    },
    enabled,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
  })

  const data = query.data
    ? query.data.pages.reduce<Channel[]>(
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

export default useGetChannels
