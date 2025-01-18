import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

export const useGetMyProfile = (data?: { enabled?: boolean }) => {
  const query = useQuery({
    queryKey: ["my-profile"],
    enabled: data?.enabled ?? false,
    queryFn: async () => {
      const response = await api.users.getMyProfile()

      return response.data
    },
  })

  return query
}
