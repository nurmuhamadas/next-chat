import { useMutation } from "@tanstack/react-query"

import { api } from "@/lib/api"

type ResponseType = InferResponse<MarkMessageAsReadResponse>
type RequestType = {
  roomType: RoomType
  receiverId: string
}

const useReadMessage = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ roomType, receiverId }) => {
      const response = await api.messages.read(roomType, receiverId)

      return response.data
    },
  })
}

export default useReadMessage
