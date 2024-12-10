import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetGroupMessages = ({ id }: { id?: string }) => {
  const query = useQuery({
    queryKey: ["group-messages", id],
    queryFn: async () => {
      const response = await client.api.messages.group[":groupId"].$get({
        param: { groupId: id ?? "" },
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    enabled: !!id,
  })

  return {
    ...query,
    data: query.data?.data ?? [],
    total: query.data?.total,
  }
}

export default useGetGroupMessages
