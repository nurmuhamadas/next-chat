import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

export const useGetMyProfile = () => {
  const query = useQuery({
    queryKey: ["my-profile"],
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
