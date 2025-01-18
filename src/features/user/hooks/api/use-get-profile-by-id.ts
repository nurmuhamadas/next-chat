import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useGetUserProfileById = ({ id }: { id?: string }) => {
  const query = useQuery({
    queryKey: ["get-user-by-id", id],
    queryFn: async () => {
      const response = await api.users.getProfile(id ?? "")

      return response.data
    },
    enabled: !!id,
  })

  return query
}

export default useGetUserProfileById
