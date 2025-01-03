import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { useScopedI18n } from "@/lib/locale/client"
import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<typeof client.api.groups.$post, 200>
type RequestType = InferRequestType<typeof client.api.groups.$post>

const useCreateGroup = () => {
  const t = useScopedI18n("group")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.groups.$post({
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

export default useCreateGroup
