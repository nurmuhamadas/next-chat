import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { useScopedI18n } from "@/lib/locale/client"
import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api)["blocked-users"][":blockedUserId"]["$delete"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api)["blocked-users"][":blockedUserId"]["$delete"]
>

const useUnblockUser = () => {
  const t = useScopedI18n("blocked_user")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api["blocked-users"][
        ":blockedUserId"
      ].$delete({ param })

      const result = await response.json()

      return result
    },
    onSuccess: () => {
      toast.success(t("messages.unblock_success"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useUnblockUser
