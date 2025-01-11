import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

type ResponseType = InferResponse<DeleteAllChannelChatResponse>
type RequestType = {
  channelId: string
}

const useDeleteChannelChat = () => {
  const t = useScopedI18n("channel.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ channelId }) => {
      const response = await api.channels.clearChat(channelId)

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

export default useDeleteChannelChat
