import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.groups)[":groupId"]["left"]["$delete"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.groups)[":groupId"]["left"]["$delete"]
>

const useLeaveGroup = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.groups[":groupId"]["left"].$delete({
        param,
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: () => {
      toast.success("LEFT_GROUP")
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useLeaveGroup
