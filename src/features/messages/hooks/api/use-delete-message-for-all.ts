import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.messages)[":messageId"]["all"]["$delete"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.messages)[":messageId"]["all"]["$delete"]
>

const useDeleteMessageForAll = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.messages[":messageId"].all.$delete({
        param,
      })

      const result = await response.json()

      return result
    },
    onSuccess: () => {},
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useDeleteMessageForAll
