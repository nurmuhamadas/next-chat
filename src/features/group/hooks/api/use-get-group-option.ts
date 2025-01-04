import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetGroupOption = ({ groupId }: { groupId?: string }) => {
  const query = useQuery({
    queryKey: ["get-group-option", groupId],
    queryFn: async () => {
      const response = await client.api.groups[":groupId"].options.$get({
        param: { groupId: groupId ?? "" },
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

export default useGetGroupOption
