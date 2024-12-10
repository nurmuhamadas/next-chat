import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetGroupMessages = ({ id, page }: { id?: string; page: number }) => {
  const query = useQuery({
    queryKey: ["group-messages", id, page],
    queryFn: async () => {
      const response = await client.api.messages.group[":groupId"].$get({
        param: { groupId: id ?? "" },
        query: { page: String(page) },
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
