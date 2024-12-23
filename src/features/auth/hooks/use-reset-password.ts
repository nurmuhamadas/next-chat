import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.auth)["password-reset"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.auth)["password-reset"]["$post"]
>

const useResetPassword = () => {
  const router = useRouter()

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["password-reset"].$post({
        json,
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: () => {
      toast.success("PASSWORD_RESET_SUCCESS")
      router.push(`/sign-in`)
    },
  })
}

export default useResetPassword
