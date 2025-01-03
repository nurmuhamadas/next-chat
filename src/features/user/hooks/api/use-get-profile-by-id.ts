import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetUserProfileById = ({ id }: { id?: string }) => {
  const query = useQuery({
    queryKey: ["get-user-by-id", id],
    queryFn: async () => {
      const response = await client.api.users[":userId"].$get({
        param: { userId: id ?? "" },
      })

      const result = await response.json()

      return result.data
    },
    enabled: !!id,
  })

  return query
}

export default useGetUserProfileById
