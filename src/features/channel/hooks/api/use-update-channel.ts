import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

import { channelSchema } from "../../schema"

type ResponseType = InferResponse<PatchChannelResponse>
type RequestType = {
  channelId: string
  data: z.infer<typeof channelSchema>
}

const useUpdateChannel = () => {
  const t = useScopedI18n("channel")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ channelId, data }) => {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("type", data.type)
      if (data.description) {
        formData.append("description", data.description)
      }
      if (data.image) {
        formData.append("image", data.image)
      }
      const response = await api.channels.update(channelId, formData)

      return response.data
    },
    onSuccess: () => {
      toast.success(t("messages.updated"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useUpdateChannel
