import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetChannelSubscribers = ({
  channelId = "",
  cursor,
}: {
  channelId?: string
  cursor?: string
}) => {
  const query = useQuery({
    queryKey: ["get-channel-subscribers", channelId],
    queryFn: async () => {
      const response = await client.api.channels[":channelId"].subscribers.$get(
        {
          param: { channelId },
          query: { cursor },
        },
      )

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result.data
    },
    enabled: !!channelId,
  })

  return query
}

export default useGetChannelSubscribers
