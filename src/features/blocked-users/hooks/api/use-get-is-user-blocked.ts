import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useGetIsUserBlocked = ({ userId = "" }: { userId?: string }) => {
  const query = useQuery({
    queryKey: ["get-is-blocked-user", userId],
    enabled: !!userId,
    queryFn: async () => {
      const response = await api.blockedUsers.getIsUserBlocked(userId)

      return response.data
    },
  })

  return query
}

export default useGetIsUserBlocked
