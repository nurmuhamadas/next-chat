import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

import { signInSchema } from "../schema"

type ResponseType = InferResponse<SignInResponse>
type RequestType = z.infer<typeof signInSchema>

const useSignIn = () => {
  const t = useScopedI18n("auth.message")

  const router = useRouter()

  return useMutation<ResponseType, ApiError, RequestType>({
    mutationFn: async (data) => {
      const response = await api.auth.signIn(data)

      return response.data
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        router.push("/")
        toast.success(t("signed_in"))
      }
    },
  })
}

export default useSignIn
