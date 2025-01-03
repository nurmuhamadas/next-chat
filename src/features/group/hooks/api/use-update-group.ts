import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { useScopedI18n } from "@/lib/locale/client"
import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.groups)[":groupId"]["$patch"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.groups)[":groupId"]["$patch"]
>

const useUpdateGroup = () => {
  const t = useScopedI18n("group")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.groups[":groupId"].$patch({
        form,
        param,
      })

      const result = await response.json()

      return result
    },
    onSuccess: () => {
      toast.success(t("messages.updated"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useUpdateGroup
