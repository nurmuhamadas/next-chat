import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<typeof client.api.auth.login.$post, 200>
type RequestType = InferRequestType<typeof client.api.auth.login.$post>

const useSignIn = () => {
  const router = useRouter()

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login.$post({
        json,
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: ({ data }) => {
      if (data.status === "unverified") {
        router.push(`/verify-email?otpId=${data.otpId}`)
      } else if (data.status === "2fa") {
        router.push(`/enter-otp?otpId=${data.otpId}`)
      } else {
        router.push("/")
        toast.success("LOGGED_IN")
      }
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useSignIn