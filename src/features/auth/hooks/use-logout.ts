import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

type ResponseType = InferResponse<LogoutResponse>

const useLogout = () => {
  const t = useScopedI18n("auth.message")

  const router = useRouter()

  return useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await api.auth.signOut()

      return response.data
    },
    onSuccess: () => {
      toast.success(t("signed_out"))
      router.push("/sign-in")
    },
  })
}

export default useLogout
