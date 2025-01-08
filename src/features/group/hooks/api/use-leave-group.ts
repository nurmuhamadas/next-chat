import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

type ResponseType = InferResponse<LeaveGroupResponse>
type RequestType = { groupId: string }

const useLeaveGroup = () => {
  const t = useScopedI18n("group.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ groupId }) => {
      const response = await api.groups.leave(groupId)

      return response.data
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
