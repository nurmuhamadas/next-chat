import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useGetChannelOption = ({ channelId = "" }: { channelId?: string }) => {
  const query = useQuery({
    queryKey: ["get-channel-option", channelId],
    queryFn: async () => {
      const response = await api.channels.options.get(channelId)

      return response.data
    },
    enabled: !!channelId,
  })

  return query
}

export default useGetChannelOption
