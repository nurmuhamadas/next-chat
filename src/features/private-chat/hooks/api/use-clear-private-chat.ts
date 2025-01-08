import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

type ResponseType = InferResponse<DeleteAllPrivateChatResponse>
type RequestType = { userId: string }

const useClearPrivateChat = () => {
  const t = useScopedI18n("private_chat.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ userId }) => {
      const response = await api.privateChat.clearChat(userId)

      return response.data
    },
    onSuccess: () => {
      toast.success(t("message_deleted"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useClearPrivateChat
