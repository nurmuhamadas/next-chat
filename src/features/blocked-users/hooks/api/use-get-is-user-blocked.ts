import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetIsUserBlocked = ({ userId = "" }: { userId?: string }) => {
  const query = useQuery({
    queryKey: ["get-is-blocked-user", userId],
    enabled: !!userId,
    queryFn: async () => {
      const response = await client.api["blocked-users"][":blockedUserId"][
        "is-blocked"
      ].$get({ param: { blockedUserId: userId } })

      const result = await response.json()

      return result.data
    },
  })

  return query
}

export default useGetIsUserBlocked
