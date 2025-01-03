import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { useScopedI18n } from "@/lib/locale/client"
import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.channels)[":channelId"]["options"]["$patch"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.channels)[":channelId"]["options"]["$patch"]
>

const useUpdateChannelOption = () => {
  const t = useScopedI18n("channel.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.channels[":channelId"]["options"][
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

export default useUpdateChannelOption
