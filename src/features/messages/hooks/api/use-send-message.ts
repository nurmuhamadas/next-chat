import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { api } from "@/lib/api"

import { createMessageSchema } from "../../schema"

type ResponseType = InferResponse<CreateMessageResponse>
type RequestType = {
  data: z.infer<typeof createMessageSchema>
}

const useSendMessage = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ data }) => {
      const formData = new FormData()
      formData.append("receiverId", data.receiverId)
      formData.append("roomType", data.roomType)
      if (data.message) {
        formData.append("message", data.message)
      }
      if (data.isEmojiOnly) {
        formData.append("isEmojiOnly", String(data.isEmojiOnly))
      }
      if (data.originalMessageId) {
        formData.append("originalMessageId", data.originalMessageId)
      }
      if (data.parentMessageId) {
        formData.append("parentMessageId", data.parentMessageId)
      }
      data.attachments?.map((file: File) =>
        formData.append("attachments", file),
      )
      const response = await api.messages.create(formData)

      return response.data
    },
    onSuccess: () => {},
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useSendMessage
