import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

type ResponseType = InferResponse<UnblockUserResponse>
type RequestType = { blockedUserId: string }

const useUnblockUser = () => {
  const t = useScopedI18n("blocked_user")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ blockedUserId }) => {
      const response = await api.blockedUsers.unblockUser(blockedUserId)

      return response.data
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
