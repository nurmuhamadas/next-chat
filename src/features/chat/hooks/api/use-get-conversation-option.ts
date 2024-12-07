import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetConversationOption = ({ id }: { id?: string }) => {
  const query = useQuery({
    queryKey: ["get-conversation-option", id],
    queryFn: async () => {
      const response = await client.api.conversations[
        ":conversationId"
      ].options.$get({
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

export default useGetConversationOption
