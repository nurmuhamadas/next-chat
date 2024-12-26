import { useEffect, useState } from "react"

import { LoaderIcon } from "lucide-react"

import ChatSkeleton from "@/components/chat-skeleton"
import { Button } from "@/components/ui/button"
import useGetGroups from "@/features/group/hooks/api/use-get-groups"
import useSearchGroups from "@/features/group/hooks/api/use-search-groups"

import { useSearchQuery } from "../../hooks/use-search-query"

import SearchResultItem from "./item"

const SearchGroupResult = () => {
  const { searchQuery } = useSearchQuery()

  const [joinedCursor, setJoinedCursor] = useState<string | undefined>()
  const [publicCursor, setPublicCursor] = useState<string | undefined>()
  const [joinedGroups, setJoinedGroups] = useState<GroupSearch[]>([])
  const [publicGroups, setPublicGroups] = useState<GroupSearch[]>([])

  const {
    data: joinedResult,
    cursor: joinedCursorResult,
    isLoading: loadingJoined,
  } = useGetGroups({
    queryKey: searchQuery,
    cursor: joinedCursor,
    limit: "5",
  })
  const {
    data: publicResult,
    cursor: publicCursorResult,
    isLoading: loadingPublic,
  } = useSearchGroups({
    queryKey: searchQuery,
    cursor: publicCursor,
    limit: "5",
  })

  const isLoading = loadingPublic || loadingJoined
  const isEmpty = joinedGroups.length === 0 && publicGroups.length === 0

  useEffect(() => {
    if (!loadingJoined && joinedResult.length > 0) {
      setJoinedGroups((v) => [...v, ...joinedResult])
    }
  }, [loadingJoined])

  useEffect(() => {
    if (!loadingPublic && publicResult.length > 0) {
      setPublicGroups((v) => [...v, ...publicResult])
    }
  }, [loadingPublic])

  useEffect(() => {
    setJoinedCursor(undefined)
    setPublicCursor(undefined)
    setJoinedGroups([])
    setPublicGroups([])
  }, [searchQuery])

  if (isLoading && isEmpty) {
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
    <div className="flex flex-col gap-y-6 px-2">
      {joinedGroups.length > 0 && (
        <div className="flex flex-col gap-y-1">
          <h4 className="px-2 text-grey-2 subtitle-2">Groups you joined</h4>
          {joinedGroups.map((user) => {
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

          {loadingJoined && joinedGroups.length > 0 && (
            <div className="h-24 flex-center">
              <LoaderIcon className="size-4 animate-spin" />
            </div>
          )}

          {joinedCursorResult && (
            <Button
              variant="link"
              onClick={() => setJoinedCursor(joinedCursorResult)}
            >
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

          {loadingPublic && publicGroups.length > 0 && (
            <div className="h-24 flex-center">
              <LoaderIcon className="size-4 animate-spin" />
            </div>
          )}

          {publicCursorResult && (
            <Button
              variant="link"
              onClick={() => setPublicCursor(publicCursorResult)}
            >
              Show more
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchGroupResult
