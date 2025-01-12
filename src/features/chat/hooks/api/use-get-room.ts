import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useGetRoom = ({ id = "" }: { id?: string }) => {
  const query = useQuery({
    queryKey: ["room", id],
    queryFn: async () => {
      const response = await api.rooms.getById(id)

      return response.data
    },
    enabled: !!id,
  })

  return query
}

export default useGetRoom
