import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { useScopedI18n } from "@/lib/locale/client"
import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<typeof client.api.settings.$patch, 200>
type RequestType = InferRequestType<typeof client.api.settings.$patch>

const useUpdateSetting = () => {
  const t = useScopedI18n("settings.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.settings.$patch({
        json,
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: () => {
      toast.success(t("settings_updated"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useUpdateSetting
