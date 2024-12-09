import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.channels)[":channelId"]["left"]["$delete"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.channels)[":channelId"]["left"]["$delete"]
>

const useLeaveChannel = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.channels[":channelId"]["left"].$delete({
        param,
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: () => {
      toast.success("LEFT_CHANNEL")
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useLeaveChannel
