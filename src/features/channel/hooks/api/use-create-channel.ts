import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<typeof client.api.channels.$post, 200>
type RequestType = InferRequestType<typeof client.api.channels.$post>

const useCreateChannel = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.channels.$post({
        form,
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: () => {
      toast.success("CHANNEL_CREATED")
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useCreateChannel
