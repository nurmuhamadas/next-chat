import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

import { groupSchema } from "../../schema"

type ResponseType = InferResponse<PatchGroupResponse>
type RequestType = {
  groupId: string
  data: Partial<z.infer<typeof groupSchema>>
}

const useUpdateGroup = () => {
  const t = useScopedI18n("group")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ groupId, data }) => {
      const formData = new FormData()
      if (data.name) {
        formData.append("name", data.name)
      }
      if (data.type) {
        formData.append("type", data.type)
      }
      if (data.description) {
        formData.append("description", data.description)
      }
      if (data.image) {
        formData.append("image", data.image)
      }

      const response = await api.groups.update(groupId, formData)

      return response.data
    },
    onSuccess: () => {
      toast.success(t("messages.updated"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useUpdateGroup
