import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetPrivateChatOption = ({ id }: { id?: string }) => {
  // TODO: implement
  const query = useQuery({
    queryKey: ["get-private-chat-option", id],
    queryFn: async () => {
      const response = await client.api.rooms[":conversationId"].options.$get({
        param: { conversationId: id ?? "" },
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

export default useGetPrivateChatOption
