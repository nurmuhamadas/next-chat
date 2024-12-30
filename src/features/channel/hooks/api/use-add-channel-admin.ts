import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.channels)[":channelId"]["subscribers"][":userId"]["admin"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.channels)[":channelId"]["subscribers"][":userId"]["admin"]["$post"]
>

const useAddChannelAdmin = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.channels[":channelId"]["subscribers"][
        ":userId"
      ]["admin"].$post({ param })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: () => {
      toast.success("ADMINS_ADDED")
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useAddChannelAdmin
