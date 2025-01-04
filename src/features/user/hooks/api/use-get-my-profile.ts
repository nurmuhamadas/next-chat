import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

export const useGetMyProfile = (data?: { enabled?: boolean }) => {
  const query = useQuery({
    queryKey: ["my-profile"],
    enabled: data?.enabled ?? false,
    queryFn: async () => {
      const response = await client.api.users["my-profile"].$get({})

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result.data
    },
  })

  return query
}
