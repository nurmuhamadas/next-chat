import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useUsernameAvaiability = ({ username }: { username: string }) => {
  const query = useQuery({
    queryKey: ["username-availability", username],
    queryFn: async () => {
      const response = await api.auth.getUsernameAvailability(username)

      return response.data
    },
    enabled: !!username,
  })

  return query
}

export default useUsernameAvaiability
