import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

import { updatePrivateChatOptionSchema } from "../../schema"

type ResponseType = InferResponse<UpdatePrivateChatOptionResponse>
type RequestType = {
  userId: string
  option: z.infer<typeof updatePrivateChatOptionSchema>
}

const useUpdatePrivateChatOption = () => {
  const t = useScopedI18n("private_chat.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ userId, option }) => {
      const response = await api.privateChat.updatePrivateChatOption(
        userId,
        option,
      )

      return response.data
    },
    onSuccess: () => {
      toast.success(t("notification_updated"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useUpdatePrivateChatOption
