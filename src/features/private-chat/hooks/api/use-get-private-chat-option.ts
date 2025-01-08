import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useGetPrivateChatOption = ({ userId = "" }: { userId?: string }) => {
  const query = useQuery({
    queryKey: ["get-private-chat-option", userId],
    queryFn: async () => {
      const response = await api.privateChat.getPrivateChatOption(userId)

      return response.data
    },
    enabled: !!userId,
  })

  return query
}

export default useGetPrivateChatOption
