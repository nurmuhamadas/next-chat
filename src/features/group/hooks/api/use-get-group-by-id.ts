import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useGetGroupById = ({ id = "" }: { id?: string }) => {
  const query = useQuery({
    queryKey: ["get-group-by-id", id],
    queryFn: async () => {
      const response = await api.groups.getById(id)

      return response.data
    },
    enabled: !!id,
  })

  return query
}

export default useGetGroupById
