import { useRef } from "react"

import { LoaderIcon } from "lucide-react"

import ChatSkeleton from "@/components/chat-skeleton"
import { Button } from "@/components/ui/button"
import useGetGroups from "@/features/group/hooks/api/use-get-groups"
import useSearchGroups from "@/features/group/hooks/api/use-search-groups"

import { useSearchQuery } from "../../hooks/use-search-query"

import SearchResultItem from "./item"

const SearchGroupResult = () => {
  const { searchQuery } = useSearchQuery()

  const lastQuery = useRef<string | undefined>(searchQuery)

  const {
    data: joinedGroups,
    isLoading: loadingJoined,
    fetchNextPage: nextJoinedGroups,
    hasNextPage: hasNextJoined,
  } = useGetGroups({
    queryKey: searchQuery,
    limit: "5",
  })
  const {
    data: publicGroups,
    isLoading: loadingPublic,
    fetchNextPage: nextPublicGroups,
    hasNextPage: hasNextPublic,
  } = useSearchGroups({
    queryKey: searchQuery,
    limit: "5",
  })

  const isLoading = loadingPublic || loadingJoined
  const isEmpty = joinedGroups.length === 0 && publicGroups.length === 0

  if (isLoading && searchQuery !== lastQuery.current) {
    return <ChatSkeleton />
  }

  if (isEmpty) {
    return (
      <div className="size-full pt-8 flex-col-center">
        <p className="text-muted-foreground">No search found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-6 px-2 pb-10">
      {joinedGroups.length > 0 && (
        <div className="flex flex-col gap-y-1">
          <h4 className="px-2 text-grey-2 subtitle-2">Groups you joined</h4>
          {joinedGroups.map((group) => {
            return (
              <SearchResultItem
                key={group.id}
                id={group.id}
                type="group"
                title={group.name}
                imageUrl={group.imageUrl ?? undefined}
                description={`${group.totalMembers} members`}
              />
            )
          })}

          {loadingJoined && searchQuery === lastQuery.current && (
            <div className="h-24 flex-center">
              <LoaderIcon className="size-4 animate-spin" />
            </div>
          )}

          {!loadingJoined && hasNextJoined && (
            <Button variant="link" onClick={() => nextJoinedGroups()}>
              Show more
            </Button>
          )}
        </div>
      )}

      {publicGroups.length > 0 && (
        <div className="flex flex-col gap-y-1">
          <h4 className="px-2 text-grey-2 subtitle-2">Public Groups</h4>
          {publicGroups.map((user) => {
            return (
              <SearchResultItem
                key={user.id}
                id={user.id}
                type="group"
                title={user.name}
                imageUrl={user.imageUrl ?? undefined}
                description={`${user.totalMembers} members`}
              />
            )
          })}

          {loadingPublic && searchQuery === lastQuery.current && (
            <div className="h-24 flex-center">
              <LoaderIcon className="size-4 animate-spin" />
            </div>
          )}

          {!loadingPublic && hasNextPublic && (
            <Button variant="link" onClick={() => nextPublicGroups()}>
              Show more
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchGroupResult
