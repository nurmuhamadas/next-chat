import ChatSkeleton from "@/components/chat-skeleton"
import useSearchUsers from "@/features/user/hooks/api/use-search-users"

import { useSearchQuery } from "../../hooks/use-search-query"

import SearchResultItem from "./item"

const SearchUserResult = () => {
  const { searchQuery } = useSearchQuery()

  const { data, total, isLoading } = useSearchUsers({ queryKey: searchQuery })

  if (isLoading) {
    return <ChatSkeleton />
  }

  if (total === 0) {
    return (
      <div className="size-full pt-8 flex-col-center">
        <p className="text-muted-foreground">No search found</p>
      </div>
    )
  }

  return (
    <div>
      {data.map((user) => {
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
    </div>
  )
}

export default SearchUserResult
