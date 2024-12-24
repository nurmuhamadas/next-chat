import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useChannelNameAvailability = ({
  channelName,
}: {
  channelName?: string
}) => {
  const query = useQuery({
    queryKey: ["get-channel-name-availability", channelName],
    queryFn: async () => {
      const response = await client.api.channels["name-availability"][
        ":channelName"
      ].$get({
        param: { channelName: channelName ?? "" },
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result.data
    },
    enabled: !!channelName,
  })

  return query
}

export default useChannelNameAvailability
