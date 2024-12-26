import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetGroupMembers = ({
  groupId = "",
  cursor,
}: {
  groupId?: string
  cursor?: string
}) => {
  const query = useQuery({
    queryKey: ["get-group-members", groupId],
    queryFn: async () => {
      const response = await client.api.groups[":groupId"].members.$get({
        param: { groupId },
        query: { cursor },
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result.data
    },
    enabled: !!groupId,
  })

  return query
}

export default useGetGroupMembers
