import { useInfiniteQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetChannelSubscribers = ({
  channelId = "",
}: {
  channelId?: string
}) => {
  const query = useInfiniteQuery({
    queryKey: ["get-channel-subscribers", channelId],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await client.api.channels[":channelId"].subscribers.$get(
        {
          param: { channelId },
          query: { cursor: pageParam },
        },
      )

      const result = await response.json()

      return result
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
