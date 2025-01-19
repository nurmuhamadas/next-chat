import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useGetSetting = () => {
  const query = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await api.settings.get()

      return response.data
    },
  })

  return query
}

export default useGetSetting
