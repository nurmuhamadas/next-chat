import { useEffect, useState } from "react"

import Link from "next/link"

import { LoaderIcon } from "lucide-react"

import ChatAvatar from "@/components/chat-avatar"
import ChatSkeleton from "@/components/chat-skeleton"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useGetChannels from "@/features/channel/hooks/api/use-get-channels"
import useSearchChannels from "@/features/channel/hooks/api/use-search-channels"
import useGetGroups from "@/features/group/hooks/api/use-get-groups"
import useSearchGroups from "@/features/group/hooks/api/use-search-groups"
import useSearchUsers from "@/features/user/hooks/api/use-search-users"

import { useSearchQuery } from "../hooks/use-search-query"

const SearchResultView = () => {
  return (
    <div className="flex-1">
      <Tabs defaultValue="user" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="user" className="flex-1">
            Users
          </TabsTrigger>
          <TabsTrigger value="group" className="flex-1">
            Groups
          </TabsTrigger>
          <TabsTrigger value="channel" className="flex-1">
            Channels
          </TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <UserResult />
        </TabsContent>
        <TabsContent value="group">
          <GroupResult />
        </TabsContent>
        <TabsContent value="channel">
          <ChannelResult />
        </TabsContent>
      </Tabs>
    </div>
  )
}

const UserResult = () => {
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
          <ResultItem
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

const GroupResult = () => {
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
      setJoinedGroups((v) => [
        ...v,
        ...joinedResult.map((g) => ({
          id: g.id,
          name: g.name,
          imageUrl: g.imageUrl,
          totalMember: g.totalMembers,
        })),
      ])
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
              <ResultItem
                key={user.id}
                id={user.id}
                type="group"
                title={user.name}
                imageUrl={user.imageUrl ?? undefined}
                description={`${user.totalMember} members`}
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
              <ResultItem
                key={user.id}
                id={user.id}
                type="group"
                title={user.name}
                imageUrl={user.imageUrl ?? undefined}
                description={`${user.totalMember} members`}
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

const ChannelResult = () => {
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
              <ResultItem
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
              <ResultItem
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

const ResultItem = ({
  id,
  title,
  type,
  imageUrl,
  description,
}: {
  id: string
  title: string
  type: RoomType
  imageUrl?: string
  description?: string
}) => {
  return (
    <Link href={`/${type}/${id}`}>
      <li className="flex items-center gap-x-3 rounded-lg p-1.5 px-3 hover:bg-grey-4">
        <ChatAvatar className="size-10" src={imageUrl} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <h4 className="flex-1 truncate h5">{title}</h4>
          <p className="flex-1 truncate text-muted-foreground body-1">
            {description}
          </p>
        </div>
      </li>
    </Link>
  )
}

export default SearchResultView
