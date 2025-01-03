import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { useScopedI18n } from "@/lib/locale/client"
import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api)["private-chat"][":userId"]["options"]["$patch"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api)["private-chat"][":userId"]["options"]["$patch"]
>

const useUpdatePrivateChatOption = () => {
  const t = useScopedI18n("private_chat.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api["private-chat"][":userId"]["options"][
        "$patch"
      ]({ json, param })

      const result = await response.json()

      return result
    },
    onSuccess: () => {
      toast.success(t("notification_updated"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useUpdatePrivateChatOption
