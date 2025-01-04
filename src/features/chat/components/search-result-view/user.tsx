import { LoaderIcon } from "lucide-react"

import ChatSkeleton from "@/components/chat-skeleton"
import { Button } from "@/components/ui/button"
import useSearchUsers from "@/features/user/hooks/api/use-search-users"
import { useScopedI18n } from "@/lib/locale/client"

import useSearchPrivateRooms from "../../hooks/api/use-search-private-rooms"
import { useSearchQuery } from "../../hooks/use-search-query"

import SearchResultItem from "./item"
const SearchUserResult = () => {
  const t = useScopedI18n("room.search.users")

  const { searchQuery } = useSearchQuery()

  const {
    data: rooms,
    isLoading: loadingRoom,
    isFetchingNextPage: loadingNextRoom,
    hasNextPage: hasNextRooms,
    fetchNextPage: fetchNextRooms,
  } = useSearchPrivateRooms({
    queryKey: searchQuery,
    limit: "5",
  })
  const {
    data: users,
    isLoading: loadingUsers,
    isFetchingNextPage: loadingNextUsers,
    hasNextPage: hasNextUsers,
    fetchNextPage: fetchNextUsers,
  } = useSearchUsers({
    queryKey: searchQuery,
    limit: "5",
  })

  const isLoading = loadingUsers || loadingRoom
  const isEmpty = rooms.length === 0 && users.length === 0

  if (isLoading && isEmpty) {
    return <ChatSkeleton />
  }

  if (isEmpty) {
    return (
      <div className="size-full pt-8 flex-col-center">
        <p className="text-muted-foreground">{t("empty")}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-6 px-2 pb-10">
      {rooms.length > 0 && (
        <div className="flex flex-col gap-y-1">
          <h4 className="px-2 text-grey-2 subtitle-2">{t("recent")}</h4>
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

          {loadingNextRoom && (
            <div className="h-24 flex-center">
              <LoaderIcon className="size-4 animate-spin" />
            </div>
          )}

          {!loadingNextRoom && hasNextRooms && (
            <Button variant="link" onClick={() => fetchNextRooms()}>
              {t("more")}
            </Button>
          )}
        </div>
      )}

      {users.length > 0 && (
        <div className="flex flex-col gap-y-1">
          <h4 className="px-2 text-grey-2 subtitle-2">{t("available")}</h4>
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

          {loadingNextUsers && (
            <div className="h-24 flex-center">
              <LoaderIcon className="size-4 animate-spin" />
            </div>
          )}

          {!loadingNextUsers && hasNextUsers && (
            <Button variant="link" onClick={() => fetchNextUsers()}>
              {t("more")}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchUserResult
