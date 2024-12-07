import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetConversations = () => {
  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await client.api.conversations.$get({})

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
  })

  return { ...query, data: query.data?.data ?? [], total: query.data?.total }
}

export default useGetConversations
