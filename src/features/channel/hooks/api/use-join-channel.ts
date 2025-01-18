import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

import { subscribeChannelSchema } from "../../schema"

type ResponseType = InferResponse<JoinChannelResponse>
type RequestType = {
  channelId: string
  data: z.infer<typeof subscribeChannelSchema>
}

const useJoinChannel = () => {
  const t = useScopedI18n("channel.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ channelId, data }) => {
      const response = await api.channels.subscribe(channelId, data)

      return response.data
    },
    onSuccess: () => {
      t("joined_channel")
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useJoinChannel
