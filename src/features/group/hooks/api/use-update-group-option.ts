import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

import { updateGroupOptionSchema } from "../../schema"

type ResponseType = InferResponse<UpdateGroupNotifResponse>
type RequestType = {
  groupId: string
  data: z.infer<typeof updateGroupOptionSchema>
}

const useUpdateGroupOption = () => {
  const t = useScopedI18n("group.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ groupId, data }) => {
      const response = await api.groups.options.update(groupId, data)

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

export default useUpdateGroupOption
