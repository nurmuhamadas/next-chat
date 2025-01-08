import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

type ResponseType = InferResponse<AddGroupMemberResponse>
type RequestType = {
  groupId: string
  userId: string
}

const useAddGroupMember = () => {
  const t = useScopedI18n("group.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ groupId, userId }) => {
      const response = await api.groups.members.add(groupId, userId)

      return response.data
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
