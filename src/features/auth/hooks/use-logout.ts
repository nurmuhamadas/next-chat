import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"
import { InferResponseType } from "hono"
import { toast } from "sonner"

import { useScopedI18n } from "@/lib/locale/client"
import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-out"]["$post"]
>

const useLogout = () => {
  const t = useScopedI18n("auth.message")

  const router = useRouter()

  return useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth["sign-out"].$post()

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: () => {
      toast.success(t("signed_out"))
      router.push("/sign-in")
    },
  })
}

export default useLogout
