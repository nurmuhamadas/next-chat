import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

type ResponseType = InferResponse<SetAdminChannelResponse>
type RequestType = {
  channelId: string
  userId: string
}

const useAddChannelAdmin = () => {
  const t = useScopedI18n("channel.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ channelId, userId }) => {
      const response = await api.channels.admins.add(channelId, userId)

      return response.data
    },
    onSuccess: () => {
      toast.success(t("added_admins"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useAddChannelAdmin
