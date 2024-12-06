import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<typeof client.api.users.$post, 200>
type RequestType = InferRequestType<typeof client.api.users.$post>

const useCreateProfile = () => {
  const router = useRouter()

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.users.$post({
        form,
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    onSuccess: () => {
      router.push("/")
      toast.success("PROFILE_CREATED")
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useCreateProfile
