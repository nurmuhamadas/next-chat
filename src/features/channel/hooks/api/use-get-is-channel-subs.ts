import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetIsChanelSubs = ({ id }: { id?: string }) => {
  const query = useQuery({
    queryKey: ["get-is-channel-subs", id],
    queryFn: async () => {
      const response = await client.api.channels[":channelId"]["is-subs"].$get({
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

export default useGetIsChanelSubs
