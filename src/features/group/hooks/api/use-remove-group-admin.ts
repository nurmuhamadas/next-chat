import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

type ResponseType = InferResponse<UnsetAdminGroupResponse>
type RequestType = {
  groupId: string
  userId: string
}

const useRemoveGroupAdmin = () => {
  const t = useScopedI18n("group.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ groupId, userId }) => {
      const response = await api.groups.admins.remove(groupId, userId)

      return response.data
    },
    onSuccess: () => {
      toast.success(t("removed_admins"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useRemoveGroupAdmin
