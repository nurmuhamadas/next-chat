import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.groups)[":groupId"]["options"]["$patch"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.groups)[":groupId"]["options"]["$patch"]
>

const useUpdateGroupOption = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.groups[":groupId"]["options"]["$patch"](
        { json, param },
      )

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: () => {
      toast.success("SETTING_UPDATED")
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useUpdateGroupOption
