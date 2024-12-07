import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.channels)[":channelId"]["$patch"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.channels)[":channelId"]["$patch"]
>

const useUpdateChannel = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.channels[":channelId"].$patch({
        form,
        param,
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: () => {
      toast.success("CHANNEL_UPDATED")
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useUpdateChannel
