import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

import { updateChannelOptionSchema } from "../../schema"

type ResponseType = InferResponse<UpdateChannelOptionResponse>
type RequestType = {
  channelId: string
  data: z.infer<typeof updateChannelOptionSchema>
}

const useUpdateChannelOption = () => {
  const t = useScopedI18n("channel.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ channelId, data }) => {
      const response = await api.channels.options.update(channelId, data)

      return response.data
    },
    onSuccess: () => {
      toast.success(t("notification_updated"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useUpdateChannelOption
