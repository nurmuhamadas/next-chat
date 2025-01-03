import { useInfiniteQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetMessages = ({
  id = "",
  roomType,
  limit,
}: {
  id: string
  roomType: RoomType
  limit?: string
}) => {
  const type =
    roomType === "chat" ? "private" : roomType === "group" ? "group" : "channel"

  const query = useInfiniteQuery({
    queryKey: ["get-messages", id, type, limit],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await client.api.messages[":roomType"][
        ":receiverId"
      ].$get({
        param: { roomType: type, receiverId: id },
        query: { limit, cursor: pageParam },
      })

      const result = await response.json()

      return result
    },
    enabled: !!id && !!type,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
  })

  const data = query.data
    ? query.data.pages.reduce<Message[]>(
        (acc, curr) => [...acc, ...curr.data],
        [],
      )
    : []

  return {
    ...query,
    data,
    pages: query.data ? query.data.pages : [],
    pageParams: query.data ? query.data.pageParams : [],
  }
}

export default useGetMessages
