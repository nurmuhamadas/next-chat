import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.groups)[":groupId"]["$patch"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.groups)[":groupId"]["$patch"]
>

const useUpdateGroup = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.groups[":groupId"].$patch({
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
      toast.success("GROUP_UPDATED")
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useUpdateGroup
