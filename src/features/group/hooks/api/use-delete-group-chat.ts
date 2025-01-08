import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

type ResponseType = InferResponse<DeleteAllGroupChatResponse>
type RequestType = { groupId: string }

const useDeleteGroupChat = () => {
  const t = useScopedI18n("group.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ groupId }) => {
      const response = await api.groups.clearChat(groupId)

      return response.data
    },
    onSuccess: () => {
      toast.success(t("delete_message"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useDeleteGroupChat
