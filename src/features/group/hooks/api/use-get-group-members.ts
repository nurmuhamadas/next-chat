import { useInfiniteQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

const useGetGroupMembers = ({ groupId = "" }: { groupId?: string }) => {
  const query = useInfiniteQuery({
    queryKey: ["get-group-members", groupId],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const response = await api.groups.members.get(groupId, {
        limit: 20,
        cursor: pageParam,
      })

      return response
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
