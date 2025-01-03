import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { useScopedI18n } from "@/lib/locale/client"
import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<typeof client.api.channels.$post, 200>
type RequestType = InferRequestType<typeof client.api.channels.$post>

const useCreateChannel = () => {
  const t = useScopedI18n("channel")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.channels.$post({
        form,
      })

      const result = await response.json()

      return result
    },
    onSuccess: () => {
      toast.success(t("messages.created"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useCreateChannel
