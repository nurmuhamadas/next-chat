import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.auth)["email-verification"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.auth)["email-verification"]["$post"]
>

const useResendVerificationEmail = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      return { success: true, data: { email: "" } }
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useResendVerificationEmail
