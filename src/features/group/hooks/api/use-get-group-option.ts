import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetGroupOption = ({ id }: { id?: string }) => {
  const query = useQuery({
    queryKey: ["get-group-option", id],
    queryFn: async () => {
      const response = await client.api.groups[":groupId"].options.$get({
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

export default useGetGroupOption
