import { useInfiniteQuery } from "@tanstack/react-query"

import { client } from "@/lib/rpc"

const useGetGroupMembers = ({ groupId = "" }: { groupId?: string }) => {
  const query = useInfiniteQuery({
    queryKey: ["get-group-members", groupId],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await client.api.groups[":groupId"].members.$get({
        param: { groupId },
        query: { cursor: pageParam },
      })

      const result = await response.json()

      return result
    },
    enabled: !!groupId,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
  })

  const data = query.data
    ? query.data.pages.reduce<GroupMember[]>(
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

export default useGetGroupMembers
