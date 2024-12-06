import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  typeof client.api.auth.register.$post,
  200
>
type RequestType = InferRequestType<typeof client.api.auth.register.$post>

const useSignUp = () => {
  const router = useRouter()

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.register.$post({
        json,
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: (result) => {
      toast.success("REGISTER_SUCCESS")
      router.push(
        `/verify-email?otpId=${result.data.otpId}&email=${result.data.email}`,
      )
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useSignUp
