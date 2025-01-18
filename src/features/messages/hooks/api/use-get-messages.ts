import { useInfiniteQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useGetMessages = ({
  id = "",
  roomType,
  limit = 20,
}: {
  id: string
  roomType: RoomType
  limit?: number
}) => {
  const query = useInfiniteQuery({
    queryKey: ["get-messages", id, roomType, limit],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await api.messages.get(roomType, id, {
        limit,
        cursor: pageParam,
      })

      return response
    },
    enabled: !!id && !!roomType,
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
