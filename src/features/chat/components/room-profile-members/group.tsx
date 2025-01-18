import { useRef } from "react"

import Link from "next/link"

import { useQueryClient } from "@tanstack/react-query"
import { LoaderIcon } from "lucide-react"

import ChatAvatar from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import useGetGroupById from "@/features/group/hooks/api/use-get-group-by-id"
import useGetGroupMembers from "@/features/group/hooks/api/use-get-group-members"
import useGetGroupOption from "@/features/group/hooks/api/use-get-group-option"
import useRemoveGroupMember from "@/features/group/hooks/api/use-remove-group-member"
import { useRoomId } from "@/hooks/use-room-id"
import { useScopedI18n } from "@/lib/locale/client"

import { useRoomProfile } from "../../hooks/use-room-profile"

const RoomProfileMembersGroup = () => {
  const t = useScopedI18n("group.info")

  const queryClient = useQueryClient()

  const removedId = useRef<string | null>(null)

  const id = useRoomId()

  const { roomProfileOpen } = useRoomProfile()

  const { mutate: removeMember, isPending: isRemoving } = useRemoveGroupMember()

  const { data: group, isLoading: loadingGroup } = useGetGroupById({
    id: roomProfileOpen ? id : undefined,
  })
  const { data: groupOption, isLoading: loadingOption } = useGetGroupOption({
    groupId: roomProfileOpen ? id : undefined,
  })
  const {
    data: members,
    isLoading: loadingMembers,
    refetch: refetchMembers,
  } = useGetGroupMembers({
    groupId: !!groupOption ? id : undefined,
  })

  const isLoading = loadingGroup || loadingOption || loadingMembers

  const handleRemoveMember = (member: GroupMember) => {
    removedId.current = member.id

    removeMember(
      { groupId: id, userId: member.id },
      {
        onSettled() {
          removedId.current = null
        },
        onSuccess() {
          refetchMembers()
          queryClient.invalidateQueries({
            queryKey: ["search-users-for-member", 20],
          })
        },
      },
    )
  }

  if (isLoading && members.length === 0) {
    return (
      <div className="h-24 flex-center">
        <LoaderIcon className="size-4 animate-spin" />
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <div className="h-24 flex-center">
        <p className="">{t("members.empty")}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-1 p-2">
      <h3 className="px-2 text-grey-2 subtitle-2">{t("members")}</h3>
      {members.length > 0 && (
        <div className="max-h-56">
          <ScrollArea className="chat-list-scroll-area">
            <ul className="flex flex-col px-1.5 pt-2">
              {members.map((v) => {
                return (
                  <li
                    className="flex cursor-pointer items-center gap-x-3 rounded-md px-3 py-2 hover:bg-grey-4"
                    key={v.id}
                  >
                    <Link href={`/chat/${v.id}`}>
                      <ChatAvatar src={v.imageUrl ?? ""} name={v.name} />
                    </Link>
                    <p className="line-clamp-1 flex-1 subtitle-2">{v.name}</p>
                    {v.isAdmin && (
                      <span className="text-grey-3 body-2">{t("admin")}</span>
                    )}
                    {group?.isAdmin && groupOption?.userId !== v.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveMember(v)
                        }}
                        disabled={isRemoving}
                      >
                        {isRemoving && removedId.current === v.id && (
                          <LoaderIcon className="size-4 animate-spin" />
                        )}
                        {t("remove")}
                      </Button>
                    )}
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

export default RoomProfileMembersGroup
