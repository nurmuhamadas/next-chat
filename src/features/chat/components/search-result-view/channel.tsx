import { useEffect, useState } from "react"

import { LoaderIcon } from "lucide-react"

import ChatSkeleton from "@/components/chat-skeleton"
import { Button } from "@/components/ui/button"
import useGetChannels from "@/features/channel/hooks/api/use-get-channels"
import useSearchChannels from "@/features/channel/hooks/api/use-search-channels"

import { useSearchQuery } from "../../hooks/use-search-query"

import SearchResultItem from "./item"

const SearchChannelResult = () => {
  const { searchQuery } = useSearchQuery()

  const [joinedCursor, setJoinedCursor] = useState<string | undefined>()
  const [publicCursor, setPublicCursor] = useState<string | undefined>()
  const [joinedChannels, setJoinedChannels] = useState<ChannelSearch[]>([])
  const [publicChannels, setPublicChannels] = useState<ChannelSearch[]>([])

  const {
    data: joinedResult,
    cursor: joinedCursorResult,
    isLoading: loadingJoined,
  } = useGetChannels({
    queryKey: searchQuery,
    cursor: joinedCursor,
    limit: "5",
  })
  const {
    data: publicResult,
    cursor: publicCursorResult,
    isLoading: loadingPublic,
  } = useSearchChannels({
    queryKey: searchQuery,
    cursor: publicCursor,
    limit: "5",
  })

  const isLoading = loadingPublic || loadingJoined
  const isEmpty = joinedChannels.length === 0 && publicChannels.length === 0

  useEffect(() => {
    if (!loadingJoined && joinedResult.length > 0) {
      setJoinedChannels((v) => [...v, ...joinedResult])
    }
  }, [loadingJoined])

  useEffect(() => {
    if (!loadingPublic && publicResult.length > 0) {
      setPublicChannels((v) => [...v, ...publicResult])
    }
  }, [loadingPublic])

  useEffect(() => {
    setJoinedCursor(undefined)
    setPublicCursor(undefined)
    setJoinedChannels([])
    setPublicChannels([])
  }, [searchQuery])

  if (isLoading && isEmpty) {
    return <ChatSkeleton />
  }

  if (isLoading) {
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
      {joinedChannels.length > 0 && (
        <div className="flex flex-col gap-y-1">
          <h4 className="px-2 text-grey-2 subtitle-2">Channels you joined</h4>
          {joinedChannels.map((user) => {
            return (
              <SearchResultItem
                key={user.id}
                id={user.id}
                type="group"
                title={user.name}
                imageUrl={user.imageUrl ?? undefined}
                description={`${user.totalSubscribers} subscribers`}
              />
            )
          })}

          {loadingJoined && joinedChannels.length > 0 && (
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

      {publicChannels.length > 0 && (
        <div className="flex flex-col gap-y-1">
          <h4 className="px-2 text-grey-2 subtitle-2">Public Channels</h4>
          {publicChannels.map((user) => {
            return (
              <SearchResultItem
                key={user.id}
                id={user.id}
                type="group"
                title={user.name}
                imageUrl={user.imageUrl ?? undefined}
                description={`${user.totalSubscribers} subscribers`}
              />
            )
          })}

          {loadingPublic && publicChannels.length > 0 && (
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

export default SearchChannelResult
