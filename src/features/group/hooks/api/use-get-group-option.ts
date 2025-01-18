import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useGetGroupOption = ({ groupId = "" }: { groupId?: string }) => {
  const query = useQuery({
    queryKey: ["get-group-option", groupId],
    queryFn: async () => {
      const response = await api.groups.options.get(groupId)

      return response.data
    },
    enabled: !!groupId,
  })

  return query
}

export default useGetGroupOption
