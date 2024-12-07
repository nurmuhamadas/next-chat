import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetIsGroupAdmin = ({ id }: { id?: string }) => {
  const query = useQuery({
    queryKey: ["get-is-group-admin", id],
    queryFn: async () => {
      const response = await client.api.groups[":groupId"]["is-admin"].$get({
        param: { groupId: id ?? "" },
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

export default useGetIsGroupAdmin
