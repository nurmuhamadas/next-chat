import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.auth)["verify-otp"][":userId"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.auth)["verify-otp"][":userId"]["$post"]
>

const useVerifyOTP = () => {
  const router = useRouter()

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.auth["verify-otp"][":userId"].$post({
        json,
        param,
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: () => {
      toast.success("REGISTER_SUCCESS")
      router.push(`/`)
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useVerifyOTP
