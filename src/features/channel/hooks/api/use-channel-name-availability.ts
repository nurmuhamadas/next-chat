import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useChannelNameAvailability = ({
  channelName = "",
}: {
  channelName?: string
}) => {
  const query = useQuery({
    queryKey: ["get-channel-name-availability", channelName],
    queryFn: async () => {
      const response = await api.channels.getNameAvailability(channelName)

      return response.data
    },
    enabled: !!channelName,
  })

  return query
}

export default useChannelNameAvailability
