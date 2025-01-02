import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { useScopedI18n } from "@/lib/locale/client"
import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api)["private-chat"][":userId"]["chat"]["$delete"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api)["private-chat"][":userId"]["chat"]["$delete"]
>

const useClearPrivateChat = () => {
  const t = useScopedI18n("private_chat.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api["private-chat"][":userId"][
        "chat"
      ].$delete({ param })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: () => {
      toast.success(t("message_deleted"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useClearPrivateChat
