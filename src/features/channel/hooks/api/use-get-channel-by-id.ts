import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useGetChannelById = ({ id = "" }: { id?: string }) => {
  const query = useQuery({
    queryKey: ["get-channel-by-id", id],
    queryFn: async () => {
      const response = await api.channels.getById(id)

      return response.data
    },
    enabled: !!id,
  })

  return query
}

export default useGetChannelById
