import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { useScopedI18n } from "@/lib/locale/client"
import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.auth)["password-reset"]["$post"],
  200
>
type RequestType = InferRequestType<
  (typeof client.api.auth)["password-reset"]["$post"]
>

const useResetPassword = () => {
  const t = useScopedI18n("auth.message")

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
      toast.success(t("password_reset_success"))
      router.push(`/sign-in`)
    },
  })
}

export default useResetPassword
