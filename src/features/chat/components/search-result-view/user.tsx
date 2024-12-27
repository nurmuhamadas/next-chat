import { useEffect, useRef, useState } from "react"

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

  const [roomCursor, setRoomCursor] = useState<string | undefined>()
  const [userCursor, setUserCursor] = useState<string | undefined>()
  const [rooms, setRooms] = useState<UserSearch[]>([])
  const [users, setUsers] = useState<UserSearch[]>([])

  const {
    data: roomResult,
    cursor: roomCursorResult,
    isLoading: loadingRoom,
  } = useSearchPrivateRooms({
    queryKey: searchQuery,
    cursor: roomCursor,
    limit: "5",
  })
  const {
    data: usersResult,
    cursor: usersCursorResult,
    isLoading: loadingUsers,
  } = useSearchUsers({
    queryKey: searchQuery,
    cursor: userCursor,
    limit: "5",
  })

  const isLoading = loadingUsers || loadingRoom
  const isEmpty = rooms.length === 0 && users.length === 0

  useEffect(() => {
    if (!loadingRoom && roomResult.length > 0) {
      const result = roomResult.map((room) => ({
        id: room.id,
        name: room.name,
        imageUrl: room.imageUrl,
        lastSeenAt: null,
      }))
      if (roomCursor) {
        setRooms((v) => [...v, ...result])
      } else {
        setRooms([...result])
      }

      lastQuery.current = searchQuery
    }
  }, [loadingRoom, roomCursor])

  useEffect(() => {
    if (!loadingUsers && usersResult.length > 0) {
      if (userCursor) {
        setUsers((v) => [...v, ...usersResult])
      } else {
        setUsers([...usersResult])
      }

      lastQuery.current = searchQuery
    }
  }, [loadingUsers, userCursor])

  useEffect(() => {
    setRoomCursor(undefined)
    setUserCursor(undefined)
  }, [searchQuery])

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

          {!loadingRoom && roomCursorResult && (
            <Button
              variant="link"
              onClick={() => setRoomCursor(roomCursorResult)}
            >
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
                type="group"
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

          {!loadingUsers && usersCursorResult && (
            <Button
              variant="link"
              onClick={() => setUserCursor(usersCursorResult)}
            >
              Show more
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchUserResult
