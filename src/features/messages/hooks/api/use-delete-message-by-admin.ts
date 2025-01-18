import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/api"

type ResponseType = InferResponse<DeleteMessageResponse>
type RequestType = {
  messageId: string
}

const useDeleteMessageByAdmin = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ messageId }) => {
      const response = await api.messages.deleteByAdmin(messageId)

      return response.data
    },
    onSuccess: () => {},
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useDeleteMessageByAdmin
