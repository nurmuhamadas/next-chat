import { useEffect, useState } from "react"

import Link from "next/link"

import ChatAvatar from "@/components/chat-avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import useGetGroupMembers from "@/features/group/hooks/api/use-get-group-members"
import useGetGroupOption from "@/features/group/hooks/api/use-get-group-option"
import { useRoomId } from "@/hooks/use-room-id"

import { useRoomProfile } from "../../hooks/use-room-profile"

const RoomProfileMembersGroup = () => {
  const id = useRoomId()

  const { roomProfileOpen } = useRoomProfile()

  const [members, setMembers] = useState<GroupMember[]>([])

  const { data: groupOption, isLoading: loadingOption } = useGetGroupOption({
    groupId: roomProfileOpen ? id : undefined,
  })
  const { data: memberResult, isLoading: loadingMembers } = useGetGroupMembers({
    groupId: roomProfileOpen ? id : undefined,
  })

  const isLoading = loadingOption || loadingMembers
  const isNoMemberView = isLoading || !groupOption || members.length === 0

  useEffect(() => {
    if (!isLoading && groupOption && memberResult) {
      setMembers(memberResult)
    }
  }, [isLoading])

  if (isNoMemberView) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-1 p-2">
      <h3 className="px-2 text-grey-2 subtitle-2">Members</h3>
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
                      <span className="text-grey-3 body-2">Admin</span>
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
