import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.messages)[":messageId"]["forwarded"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.messages)[":messageId"]["forwarded"]["$post"]
>

const useForwardMessage = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.messages[":messageId"].forwarded.$post({
        param,
        json,
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

export default useForwardMessage
