import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

type ResponseType = InferResponse<UnsetAdminChannelResponse>
type RequestType = {
  channelId: string
  userId: string
}

const useRemoveChannelAdmin = () => {
  const t = useScopedI18n("channel.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ channelId, userId }) => {
      const response = await api.channels.admins.remove(channelId, userId)

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

export default useRemoveChannelAdmin
