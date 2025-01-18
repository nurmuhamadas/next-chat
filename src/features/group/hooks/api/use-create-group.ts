import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

import { groupSchema } from "../../schema"

type ResponseType = InferResponse<CreateGroupResponse>
type RequestType = z.infer<typeof groupSchema>

const useCreateGroup = () => {
  const t = useScopedI18n("group")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("type", data.type)
      data.memberIds.map((id) => formData.append("memberIds", id))
      if (data.description) {
        formData.append("description", data.description)
      }
      if (data.image) {
        formData.append("image", data.image)
      }

      const response = await api.groups.create(formData)

      return response.data
    },
    onSuccess: () => {
      toast.success(t("messages.created"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useCreateGroup
