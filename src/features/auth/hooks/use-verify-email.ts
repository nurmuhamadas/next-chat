import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.auth)["verify-email"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.auth)["verify-email"]["$post"]
>

const useVerifyEmail = () => {
  const router = useRouter()

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["verify-email"].$post({
        json,
      })

      const result = await response.json()

      return result
    },
    onSuccess: () => {
      router.push(`/`)
    },
  })
}

export default useVerifyEmail
