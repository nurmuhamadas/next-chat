import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.auth)["email-password-reset"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.auth)["email-password-reset"]["$post"]
>

const useRequestPasswordReset = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      return { success: true, data: { email: "" } }
    },
  })
}

export default useRequestPasswordReset
