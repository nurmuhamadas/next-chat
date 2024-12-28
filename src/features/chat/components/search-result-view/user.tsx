import { useRef } from "react"

import { LoaderIcon } from "lucide-react"

import ChatSkeleton from "@/components/chat-skeleton"
import { Button } from "@/components/ui/button"
import useSearchUsers from "@/features/user/hooks/api/use-search-users"

import useSearchPrivateRooms from "../../hooks/api/use-search-private-rooms"
import { useSearchQuery } from "../../hooks/use-search-query"

import SearchResultItem from "./item"
const SearchUserResult = () => {
  const { searchQuery } = useSearchQuery()

  const lastQuery = useRef<string | undefined>(searchQuery)

  const {
    data: rooms,
    isLoading: loadingRoom,
    hasNextPage: hasNextRooms,
    fetchNextPage: fetchNextRooms,
  } = useSearchPrivateRooms({
    queryKey: searchQuery,
    limit: "5",
  })
  const {
    data: users,
    isLoading: loadingUsers,
    hasNextPage: hasNextUsers,
    fetchNextPage: fetchNextUsers,
  } = useSearchUsers({
    queryKey: searchQuery,
    limit: "5",
  })

  const isLoading = loadingUsers || loadingRoom
  const isEmpty = rooms.length === 0 && users.length === 0

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
      {rooms.length > 0 && (
        <div className="flex flex-col gap-y-1">
          <h4 className="px-2 text-grey-2 subtitle-2">Recent users</h4>
          {rooms.map((user) => {
            return (
              <SearchResultItem
                key={user.id}
                id={user.id}
                type="chat"
                title={user.name}
                imageUrl={user.imageUrl ?? undefined}
                description={user.lastSeenAt ?? undefined}
              />
            )
          })}

          {loadingRoom && searchQuery === lastQuery.current && (
            <div className="h-24 flex-center">
              <LoaderIcon className="size-4 animate-spin" />
            </div>
          )}

          {!loadingRoom && hasNextRooms && (
            <Button variant="link" onClick={() => fetchNextRooms()}>
              Show more
            </Button>
          )}
        </div>
      )}

      {users.length > 0 && (
        <div className="flex flex-col gap-y-1">
          <h4 className="px-2 text-grey-2 subtitle-2">Available users</h4>
          {users.map((user) => {
            return (
              <SearchResultItem
                key={user.id}
                id={user.id}
                type="chat"
                title={user.name}
                imageUrl={user.imageUrl ?? undefined}
                description={user.lastSeenAt ?? undefined}
              />
            )
          })}

          {loadingUsers && searchQuery === lastQuery.current && (
            <div className="h-24 flex-center">
              <LoaderIcon className="size-4 animate-spin" />
            </div>
          )}

          {!loadingUsers && hasNextUsers && (
            <Button variant="link" onClick={() => fetchNextUsers()}>
              Show more
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchUserResult
