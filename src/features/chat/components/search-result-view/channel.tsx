import { useEffect, useRef, useState } from "react"

import { LoaderIcon } from "lucide-react"

import ChatSkeleton from "@/components/chat-skeleton"
import { Button } from "@/components/ui/button"
import useGetChannels from "@/features/channel/hooks/api/use-get-channels"
import useSearchChannels from "@/features/channel/hooks/api/use-search-channels"

import { useSearchQuery } from "../../hooks/use-search-query"

import SearchResultItem from "./item"

const SearchChannelResult = () => {
  const { searchQuery } = useSearchQuery()

  const lastQuery = useRef<string | undefined>(searchQuery)

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
      if (joinedCursor) {
        setJoinedChannels((v) => [...v, ...joinedResult])
      } else {
        setJoinedChannels([...joinedResult])
      }

      lastQuery.current = searchQuery
    }
  }, [loadingJoined, joinedCursor])

  useEffect(() => {
    if (!loadingPublic && publicResult.length > 0) {
      if (publicCursor) {
        setPublicChannels((v) => [...v, ...publicResult])
      } else {
        setPublicChannels([...publicResult])
      }

      lastQuery.current = searchQuery
    }
  }, [loadingPublic, publicCursor])

  useEffect(() => {
    setJoinedCursor(undefined)
    setPublicCursor(undefined)
  }, [searchQuery])

  if (isLoading && searchQuery !== lastQuery.current) {
    return <ChatSkeleton />
  }

  if (isEmpty) {
    return (
      <div className="size-full pb-10 pt-8 flex-col-center">
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
                type="channel"
                title={user.name}
                imageUrl={user.imageUrl ?? undefined}
                description={`${user.totalSubscribers} subscribers`}
              />
            )
          })}

          {loadingJoined && searchQuery === lastQuery.current && (
            <div className="h-24 flex-center">
              <LoaderIcon className="size-4 animate-spin" />
            </div>
          )}

          {!loadingJoined && joinedCursorResult && (
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
                type="channel"
                title={user.name}
                imageUrl={user.imageUrl ?? undefined}
                description={`${user.totalSubscribers} subscribers`}
              />
            )
          })}

          {loadingPublic && searchQuery === lastQuery.current && (
            <div className="h-24 flex-center">
              <LoaderIcon className="size-4 animate-spin" />
            </div>
          )}

          {!loadingPublic && publicCursorResult && (
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
