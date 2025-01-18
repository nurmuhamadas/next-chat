import { useInfiniteQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useGetChannelSubscribers = ({
  channelId = "",
  queryKey,
  limit = 20,
}: {
  channelId?: string
  queryKey?: string
  limit?: number
}) => {
  const query = useInfiniteQuery({
    queryKey: ["get-channel-subscribers", channelId],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await api.channels.subscribers.get(channelId, {
        limit,
        query: queryKey,
        cursor: pageParam,
      })

      return response
    },
    enabled: !!channelId,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
  })

  const data = query.data
    ? query.data.pages.reduce<ChannelSubscriber[]>(
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

export default useGetChannelSubscribers
