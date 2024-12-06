import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

export const useValidateUsername = ({ username }: { username: string }) => {
  const query = useQuery({
    queryKey: ["username-availability", username],
    queryFn: async () => {
      const response = await client.api.users["username-availability"][
        ":username"
      ].$get({
        param: { username },
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result.data
    },
  })

  return query
}
