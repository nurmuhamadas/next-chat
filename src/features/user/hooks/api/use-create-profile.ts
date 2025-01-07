import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

import { profileSchema } from "../../schema"

type ResponseType = InferResponse<CreateUserProfileResponse>
type RequestType = z.infer<typeof profileSchema>

const useCreateProfile = () => {
  const t = useScopedI18n("my_profile")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("gender", data.gender)
      if (data.bio) {
        formData.append("bio", data.bio)
      }
      if (data.image) {
        formData.append("image", data.image)
      }

      const response = await api.users.createUserProfile(formData)

      return response.data
    },
    onSuccess: () => {
      toast.success(t("messages.profile_created"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useCreateProfile
