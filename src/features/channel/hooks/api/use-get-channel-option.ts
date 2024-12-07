import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetChannelOption = ({ id }: { id?: string }) => {
  const query = useQuery({
    queryKey: ["get-channel-option", id],
    queryFn: async () => {
      const response = await client.api.channels[":channelId"].options.$get({
        param: { channelId: id ?? "" },
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result.data
    },
    enabled: !!id,
  })

  return query
}

export default useGetChannelOption
