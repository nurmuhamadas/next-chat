import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { z } from "zod"

import { settingSchema } from "@/features/settings/schema"
import { api } from "@/lib/api"
import { useScopedI18n } from "@/lib/locale/client"

type ResponseType = InferResponse<UpdateSettingResponse>
type RequestType = z.infer<typeof settingSchema>

const useUpdateSetting = () => {
  const t = useScopedI18n("settings.messages")

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await api.settings.update(data)

      return response.data
    },
    onSuccess: () => {
      toast.success(t("settings_updated"))
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useUpdateSetting
