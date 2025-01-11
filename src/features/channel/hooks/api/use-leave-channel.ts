import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

type ResponseType = InferResponse<LeaveChannelResponse>
type RequestType = {
  channelId: string
}

const useLeaveChannel = () => {
  const t = useScopedI18n("channel.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ channelId }) => {
      const response = await api.channels.unsubscribe(channelId)

      return response.data
    },
    onSuccess: () => {
      toast.success(t("left_channel"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useLeaveChannel
