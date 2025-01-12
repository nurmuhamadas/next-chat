import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/api"

type ResponseType = InferResponse<DeleteRoomResponse>
type RequestType = {
  roomId: string
}

const useDeleteRoom = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ roomId }) => {
      const response = await api.rooms.delete(roomId)

      return response.data
    },
    onSuccess: () => {},
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useDeleteRoom
