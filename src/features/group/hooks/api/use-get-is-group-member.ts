import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetIsGroupMember = ({ id }: { id?: string }) => {
  const query = useQuery({
    queryKey: ["get-is-group-member", id],
    queryFn: async () => {
      const response = await client.api.groups[":groupId"]["is-member"].$get({
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

export default useGetIsGroupMember
