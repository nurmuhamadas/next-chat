import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetRooms = ({ cursor }: { cursor?: string }) => {
  const query = useQuery({
    queryKey: ["rooms", cursor],
    queryFn: async () => {
      const response = await client.api.rooms.$get({ query: { cursor } })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
  })

  return { ...query, data: query.data?.data ?? [], total: query.data?.total }
}

export default useGetRooms
