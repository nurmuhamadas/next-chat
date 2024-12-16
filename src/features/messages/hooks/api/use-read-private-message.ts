import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.messages.private)[":userId"]["read"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.messages.private)[":userId"]["read"]["$post"]
>

const useReadPrivateMessage = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.messages.private[":userId"].read.$post({
        param,
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
  })
}

export default useReadPrivateMessage