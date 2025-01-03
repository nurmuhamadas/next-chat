import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { useScopedI18n } from "@/lib/locale/client"
import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.groups)[":groupId"]["left"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.groups)[":groupId"]["left"]["$post"]
>

const useLeaveGroup = () => {
  const t = useScopedI18n("group.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.groups[":groupId"]["left"].$post({
        param,
      })

      const result = await response.json()

      return result
    },
    onSuccess: () => {
      toast.success(t("left_group"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useLeaveGroup
