import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { useScopedI18n } from "@/lib/locale/client"
import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.groups)[":groupId"]["members"][":userId"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.groups)[":groupId"]["members"][":userId"]["$post"]
>

const useAddGroupMember = () => {
  const t = useScopedI18n("group.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.groups[":groupId"]["members"][
        ":userId"
      ].$post({ param })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: () => {
      toast.success(t("added_members"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useAddGroupMember
