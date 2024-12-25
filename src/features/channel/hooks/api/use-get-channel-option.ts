import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetChannelOption = ({ channelId }: { channelId?: string }) => {
  const query = useQuery({
    queryKey: ["get-channel-option", channelId],
    queryFn: async () => {
      const response = await client.api.channels[":channelId"].options.$get({
        param: { channelId: channelId ?? "" },
      })

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

export default useGetChannelOption
