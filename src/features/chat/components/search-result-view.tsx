import Link from "next/link"

import ChatAvatar from "@/components/chat-avatar"
import ChatSkeleton from "@/components/chat-skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useSearchChannels from "@/features/channel/hooks/api/use-search-channels"
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

  const { data, total, isLoading } = useSearchGroups({ queryKey: searchQuery })

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
            type="group"
            title={user.name}
            imageUrl={user.imageUrl ?? undefined}
            description={`${user.totalMember} members`}
          />
        )
      })}
    </div>
  )
}

const ChannelResult = () => {
  const { searchQuery } = useSearchQuery()

  const { data, total, isLoading } = useSearchChannels({
    queryKey: searchQuery,
  })

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
            type="channel"
            title={user.name}
            imageUrl={user.imageUrl ?? undefined}
            description={`${user.totalSubscribers} subscribers`}
          />
        )
      })}
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
