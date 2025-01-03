import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGroupNameAvailability = ({ groupName }: { groupName?: string }) => {
  const query = useQuery({
    queryKey: ["get-group-name-availability", groupName],
    queryFn: async () => {
      const response = await client.api.groups["name-availability"][
        ":groupName"
      ].$get({
        param: { groupName: groupName ?? "" },
      })

      const result = await response.json()

      return result.data
    },
    enabled: !!groupName,
  })

  return query
}

export default useGroupNameAvailability
