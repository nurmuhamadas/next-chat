import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { api } from "@/lib/api"

import { forwardMessageSchema } from "../../schema"

type ResponseType = InferResponse<ForwardMessageResponse>
type RequestType = {
  messageId: string
  data: z.infer<typeof forwardMessageSchema>
}

const useForwardMessage = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ messageId, data }) => {
      const response = await api.messages.forward(messageId, data)

      return response.data
    },
    onSuccess: () => {},
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useForwardMessage
