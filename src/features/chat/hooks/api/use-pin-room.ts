import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/api"

type ResponseType = InferResponse<PinRoomResponse>
type RequestType = {
  roomId: string
}

const usePinRoom = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ roomId }) => {
      const response = await api.rooms.pinned.add(roomId)

      return response.data
    },
    onSuccess: () => {},
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default usePinRoom
