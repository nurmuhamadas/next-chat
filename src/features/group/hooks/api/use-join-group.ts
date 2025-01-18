import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

import { joinGroupSchema } from "../../schema"

type ResponseType = InferResponse<JoinGroupResponse>
type RequestType = {
  groupId: string
  data: z.infer<typeof joinGroupSchema>
}

const useJoinGroup = () => {
  const t = useScopedI18n("group.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ groupId, data }) => {
      const response = await api.groups.join(groupId, data)

      return response.data
    },
    onSuccess: () => {
      toast.success(t("joined_group"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useJoinGroup
