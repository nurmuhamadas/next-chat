import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetGroupById = ({ id }: { id?: string }) => {
  const query = useQuery({
    queryKey: ["get-group-by-id", id],
    queryFn: async () => {
      const response = await client.api.groups[":groupId"].$get({
        param: { groupId: id ?? "" },
      })

      const result = await response.json()

      return result.data
    },
    enabled: !!id,
  })

  return query
}

export default useGetGroupById
