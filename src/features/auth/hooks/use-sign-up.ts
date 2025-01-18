import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

import { signUpSchema } from "../schema"

type ResponseType = InferResponse<SignUpResponse>
type RequestType = z.infer<typeof signUpSchema>

const useSignUp = () => {
  const t = useScopedI18n("auth.message")

  return useMutation<ResponseType, ApiError, RequestType>({
    mutationFn: async (data) => {
      const response = await api.auth.signUp(data)

      return response.data
    },
    onSuccess: () => {
      toast.success(t("register_success"))
    },
  })
}

export default useSignUp
