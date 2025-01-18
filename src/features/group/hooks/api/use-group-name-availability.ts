import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useGroupNameAvailability = ({
  groupName = "",
}: {
  groupName?: string
}) => {
  const query = useQuery({
    queryKey: ["get-group-name-availability", groupName],
    queryFn: async () => {
      const response = await api.groups.getNameAvailability(groupName)

      return response.data
    },
    enabled: !!groupName,
  })

  return query
}

export default useGroupNameAvailability
