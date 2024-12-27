import { useQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetMessages = ({
  id = "",
  roomType,
  limit,
  cursor,
}: {
  id: string
  roomType: RoomType
  limit?: string
  cursor?: string
}) => {
  const type =
    roomType === "chat" ? "private" : roomType === "group" ? "group" : "channel"

  const query = useQuery({
    queryKey: ["get-messages", id, type, limit, cursor],
    queryFn: async () => {
      const response = await client.api.messages[":roomType"][
        ":receiverId"
      ].$get({
        param: { roomType: type, receiverId: id },
        query: { limit, cursor },
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error.message)
      }

      return result
    },
    enabled: !!id && !!type,
  })

  return {
    ...query,
    data: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    cursor: query.data?.cursor,
  }
}

export default useGetMessages
