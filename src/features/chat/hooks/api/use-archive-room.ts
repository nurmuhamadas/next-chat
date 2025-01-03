import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.rooms.archived)[":roomId"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.rooms.archived)[":roomId"]["$post"]
>

const useArchiveRoom = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.rooms.archived[":roomId"].$post({
        param,
      })

      const result = await response.json()

      return result
    },
    onSuccess: () => {},
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useArchiveRoom
