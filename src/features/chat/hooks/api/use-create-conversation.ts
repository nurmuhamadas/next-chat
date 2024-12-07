import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.conversations)["$post"],
  200
>
type RequestType = InferRequestType<(typeof client.api.conversations)["$post"]>

const useCreateConversation = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.conversations.$post({ json })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: () => {
      toast.success("CONVERSATION_CREATED")
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useCreateConversation
