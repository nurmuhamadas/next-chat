import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetPrivateMessages = ({ id }: { id?: string }) => {
  const query = useQuery({
    queryKey: ["private-messages", id],
    queryFn: async () => {
      const response = await client.api.messages.private[":userId"].$get({
        param: { userId: id ?? "" },
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

export default useGetPrivateMessages
