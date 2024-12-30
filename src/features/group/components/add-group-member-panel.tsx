import { useRef, useState } from "react"

import { useQueryClient } from "@tanstack/react-query"
import { LoaderIcon } from "lucide-react"
import { toast } from "sonner"

import ChatAvatar from "@/components/chat-avatar"
import RightPanelWrapper from "@/components/right-panel-wrapper"
import SearchBar from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import useSearchUsersForMember from "@/features/user/hooks/api/use-search-users-for-member"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"
import { cn, debounce } from "@/lib/utils"

import useAddGroupMember from "../hooks/api/use-add-group-member"
import useGetGroupById from "../hooks/api/use-get-group-by-id"
import { useAddGroupMemberPanel } from "../hooks/use-add-group-member-panel"

const AddGroupMemberPanel = () => {
  const queryClient = useQueryClient()

  const type = useRoomType()
  const id = useRoomId()

  const addingUserId = useRef<string | null>(null)

  const { isAddGroupMemberOpen, closeAddGroupMember } = useAddGroupMemberPanel()

  const [searchKey, setSearchKey] = useState<string | undefined>()

  const { mutate: addMember, isPending } = useAddGroupMember()

  const {
    data: users,
    isLoading: loadingUser,
    refetch: refetchUsers,
  } = useSearchUsersForMember({
    queryKey: searchKey,
    groupId: id,
  })
  const { data: group, isLoading: loadingGroup } = useGetGroupById({
    id: type === "group" ? id : undefined,
  })

  const debouncedSearchKey = debounce((value: string) => {
    setSearchKey(!!value ? value : undefined)
  }, 500)

  const handleAddUser = (user: UserSearchForMember) => {
    if (isPending) return

    if (user.allowAddToGroup) {
      addingUserId.current = user.id
      addMember(
        {
          param: { groupId: id, userId: user.id },
        },
        {
          onSuccess() {
            closeAddGroupMember()
            refetchUsers()
            queryClient.invalidateQueries({
              queryKey: ["get-group-members", id],
            })
          },
          onSettled() {
            addingUserId.current = null
          },
        },
      )
    } else {
      toast.error("ADD_USER_NOT_ALLOWED")
    }
  }

  return (
    <RightPanelWrapper
      title="Add Members"
      isOpen={isAddGroupMemberOpen}
      onBack={closeAddGroupMember}
    >
      <div className="flex flex-col gap-y-6 px-4 pb-8 pt-4">
        {loadingGroup && (
          <div className="h-24 flex-center">
            <LoaderIcon className="size-5 animate-spin" />
          </div>
        )}

        {!loadingGroup && !group?.isAdmin && <></>}

        {!loadingGroup && group?.isAdmin && (
          <>
            <SearchBar onValueChange={debouncedSearchKey} />
            <ScrollArea className="chat-list-scroll-area">
              {loadingUser && (
                <div className="h-24 flex-center">
                  <LoaderIcon className="size-5 animate-spin" />
                </div>
              )}
              {!loadingUser && users.length === 0 && (
                <div className="h-24 flex-center">
                  <p className="">No user found</p>
                </div>
              )}
              {!loadingUser && users.length > 0 && (
                <ul className="flex flex-col">
                  {users.map((user) => {
                    return (
                      <li
                        key={user.id}
                        className={cn(
                          "flex items-center gap-x-3 rounded-lg p-1.5 px-3 hover:bg-grey-4",
                          isPending && "bg-muted",
                        )}
                      >
                        <ChatAvatar
                          className="size-10"
                          src={user.imageUrl ?? ""}
                        />

                        <div className="flex flex-1 flex-col overflow-hidden">
                          <h4 className="flex-1 truncate h5">{user.name}</h4>
                          {/* <p className="flex-1 truncate text-muted-foreground body-1">
                            {description}
                          </p> */}
                        </div>

                        <Button
                          variant="outline"
                          disabled={isPending}
                          onClick={() => handleAddUser(user)}
                        >
                          {isPending && addingUserId.current === user.id && (
                            <LoaderIcon className="size-4 animate-spin" />
                          )}
                          Add
                        </Button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </ScrollArea>
          </>
        )}
      </div>
    </RightPanelWrapper>
  )
}

export default AddGroupMemberPanel
