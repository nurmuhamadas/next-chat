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
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["email-password-reset"].$post({
        json,
      })

      const result = await response.json()

      return result
    },
  })
}

export default useRequestPasswordReset
