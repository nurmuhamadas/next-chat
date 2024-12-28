import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.messages)[":messageId"]["me"]["$delete"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.messages)[":messageId"]["me"]["$delete"]
>

const useDeleteMessageForMe = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.messages[":messageId"].me.$delete({
        param,
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: () => {},
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useDeleteMessageForMe
