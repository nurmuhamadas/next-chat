import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { useScopedI18n } from "@/lib/locale/client"
import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.channels)[":channelId"]["subscribers"][":userId"]["admin"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.channels)[":channelId"]["subscribers"][":userId"]["admin"]["$post"]
>

const useAddChannelAdmin = () => {
  const t = useScopedI18n("channel.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.channels[":channelId"]["subscribers"][
        ":userId"
      ]["admin"].$post({ param })

      const result = await response.json()

      return result
    },
    onSuccess: () => {
      toast.success(t("added_admins"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useAddChannelAdmin
