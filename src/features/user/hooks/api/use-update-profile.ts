import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

import { profileSchema } from "../../schema"

type ResponseType = InferResponse<CreateUserProfileResponse>
type RequestType = Partial<z.infer<typeof profileSchema>>

const useUpdateProfile = () => {
  const t = useScopedI18n("my_profile")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const formData = new FormData()
      if (data.name) {
        formData.append("name", data.name)
      }
      if (data.gender) {
        formData.append("gender", data.gender)
      }
      if (data.bio) {
        formData.append("bio", data.bio)
      }
      if (data.image) {
        formData.append("image", data.image)
      }

      const response = await api.users.updateUserProfile(formData)

      return response.data
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
