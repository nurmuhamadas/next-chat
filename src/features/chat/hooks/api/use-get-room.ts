import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetRoom = ({ id = "" }: { id?: string }) => {
  const query = useQuery({
    queryKey: ["room", id],
    queryFn: async () => {
      const response = await client.api.rooms[":roomId"].$get({
        param: { roomId: id },
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

export default useGetRoom
