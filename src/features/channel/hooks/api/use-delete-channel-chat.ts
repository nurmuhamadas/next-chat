import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { useScopedI18n } from "@/lib/locale/client"
import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.channels)[":channelId"]["chat"]["$delete"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.channels)[":channelId"]["chat"]["$delete"]
>

const useDeleteChannelChat = () => {
  const t = useScopedI18n("channel.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.channels[":channelId"]["chat"].$delete({
        param,
      })

      const result = await response.json()

      return result
    },
    onSuccess: () => {
      toast.success(t("delete_message"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useDeleteChannelChat
