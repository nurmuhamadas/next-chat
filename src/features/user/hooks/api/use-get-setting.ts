import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetSetting = () => {
  const query = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await client.api.settings.$get({})

      const result = await response.json()

      return result.data
    },
  })

  return query
}

export default useGetSetting
