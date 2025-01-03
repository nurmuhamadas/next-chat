import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetChannelById = ({ id }: { id?: string }) => {
  const query = useQuery({
    queryKey: ["get-channel-by-id", id],
    queryFn: async () => {
      const response = await client.api.channels[":channelId"].$get({
        param: { channelId: id ?? "" },
      })

      const result = await response.json()

      return result.data
    },
    enabled: !!id,
  })

  return query
}

export default useGetChannelById
