import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetPrivateChatOption = ({ userId = "" }: { userId?: string }) => {
  const query = useQuery({
    queryKey: ["get-private-chat-option", userId],
    queryFn: async () => {
      const response = await client.api["private-chat"][":userId"].options.$get(
        {
          param: { userId },
        },
      )

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result.data
    },
    enabled: !!userId,
  })

  return query
}

export default useGetPrivateChatOption
