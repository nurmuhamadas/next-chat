import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { useScopedI18n } from "@/lib/locale/client"
import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<typeof client.api.users.$patch, 200>
type RequestType = InferRequestType<typeof client.api.users.$patch>

const useUpdateProfile = () => {
  const t = useScopedI18n("my_profile")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.users.$patch({
        form,
      })

      const result = await response.json()

      return result
    },
    onSuccess: () => {
      toast.success(t("messages.profile_updated"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useUpdateProfile
