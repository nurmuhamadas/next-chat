import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-in-email"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.auth)["sign-in-email"]["$post"]
>

const useSignInEmail = () => {
  const router = useRouter()

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["sign-in-email"].$post({
        json,
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: () => {
      router.push(`/`)
    },
  })
}

export default useSignInEmail
