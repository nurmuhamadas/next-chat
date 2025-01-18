import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { api } from "@/lib/api"

import { updateMessageSchema } from "../../schema"

type ResponseType = InferResponse<UpdateMessageResponse>
type RequestType = {
  messageId: string
  data: z.infer<typeof updateMessageSchema>
}

const useUpdateMessage = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ messageId, data }) => {
      const response = await api.messages.update(messageId, data)

      return response.data
    },
    onSuccess: () => {},
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useUpdateMessage
