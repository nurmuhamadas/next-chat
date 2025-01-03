import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useUsernameAvaiability = ({ username }: { username: string }) => {
  const query = useQuery({
    queryKey: ["username-availability", username],
    queryFn: async () => {
      const response = await client.api.auth["username-availability"][
        ":username"
      ].$get({
        param: { username },
      })

      const result = await response.json()

      return result.data
    },
    enabled: !!username,
  })

  return query
}

export default useUsernameAvaiability
