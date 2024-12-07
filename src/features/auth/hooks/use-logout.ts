import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"
import { InferResponseType } from "hono"
import { toast } from "sonner"

import { client } from "@/lib/rpc"

type ResponseType = InferResponseType<typeof client.api.auth.logout.$post>

const useLogout = () => {
  const router = useRouter()

  return useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$post()

      const result = await response.json()

      return result
    },
    onSuccess: () => {
      toast.success("LOGGED_OUT")
      router.push("/sign-in")
    },
    onError({ message }) {
      toast.error(message)
    },
  })
}

export default useLogout