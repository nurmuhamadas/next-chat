import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/api"

type ResponseType = InferResponse<UnarchiveRoomResponse>
type RequestType = { roomId: string }

const useUnarchiveRoom = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ roomId }) => {
      const response = await api.rooms.archived.remove(roomId)

      return response.data
    },
    onSuccess: () => {},
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useUnarchiveRoom
