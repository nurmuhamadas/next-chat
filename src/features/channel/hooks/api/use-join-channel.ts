import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { useScopedI18n } from "@/lib/locale/client"
import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.channels)[":channelId"]["join"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.channels)[":channelId"]["join"]["$post"]
>

const useJoinChannel = () => {
  const t = useScopedI18n("channel.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.channels[":channelId"]["join"].$post({
        json,
        param,
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: () => {
      t("joined_channel")
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useJoinChannel
