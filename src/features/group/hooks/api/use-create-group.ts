import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<typeof client.api.groups.$post, 200>
type RequestType = InferRequestType<typeof client.api.groups.$post>

const useCreateGroup = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.groups.$post({
        form,
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: () => {
      toast.success("GROUP_CREATED")
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useCreateGroup
