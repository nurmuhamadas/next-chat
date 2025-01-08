import { useRef } from "react"

import { LoaderIcon } from "lucide-react"

import ChatAvatar from "@/components/chat-avatar"
import RightPanelWrapper from "@/components/right-panel-wrapper"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRoomId } from "@/hooks/use-room-id"
import { useScopedI18n } from "@/lib/locale/client"
import { cn } from "@/lib/utils"

import useAddGroupAdmin from "../hooks/api/use-add-group-admin"
import useGetGroupById from "../hooks/api/use-get-group-by-id"
import useGetGroupMembers from "../hooks/api/use-get-group-members"
import useGetGroupOption from "../hooks/api/use-get-group-option"
import { useAddGroupAdminPanel } from "../hooks/use-add-group-admin-panel"

const AddGroupAdminsPanel = () => {
  const t = useScopedI18n("group.admin.add")

  const id = useRoomId()

  const addedUserId = useRef<string | null>(null)

  const { isAddGroupAdminOpen, closeAddGroupAdmin } = useAddGroupAdminPanel()

  const { mutate: addAdmin, isPending } = useAddGroupAdmin()

  const {
    data: members,
    isLoading: loadingMember,
    refetch: refetchMembers,
  } = useGetGroupMembers({
    groupId: isAddGroupAdminOpen ? id : undefined,
  })
  const { data: group, isLoading: loadingGroup } = useGetGroupById({
    id: isAddGroupAdminOpen ? id : undefined,
  })
  const { data: groupOption, isLoading: loadingOption } = useGetGroupOption({
    groupId: isAddGroupAdminOpen ? id : undefined,
  })

  const isLoading = loadingMember || loadingGroup || loadingOption
  const usersNotadmin = members.filter((member) => !member.isAdmin)

  const handleAddAdmin = (user: GroupMember) => {
    if (isPending) return

    addedUserId.current = user.id
    addAdmin(
      { groupId: id, userId: user.id },
      {
        onSuccess() {
          refetchMembers()
        },
        onSettled() {
          addedUserId.current = null
        },
      },
    )
  }

  return (
    <RightPanelWrapper
      title={t("title")}
      isOpen={isAddGroupAdminOpen}
      onBack={closeAddGroupAdmin}
    >
      <div className="flex flex-col gap-y-6 px-4 pb-8 pt-4">
        {isLoading ? (
          <div className="h-24 flex-center">
            <LoaderIcon className="size-5 animate-spin" />
          </div>
        ) : !group?.isAdmin ? (
          <></>
        ) : usersNotadmin.length > 0 ? (
          <ScrollArea className="chat-list-scroll-area">
            <ul className="flex flex-col">
              {usersNotadmin.map((user) => {
                return (
                  <li
                    key={user.id}
                    className={cn(
                      "flex items-center gap-x-3 rounded-lg p-1.5 px-3 hover:bg-grey-4",
                      isPending && "bg-muted",
                    )}
                  >
                    <ChatAvatar className="size-10" src={user.imageUrl ?? ""} />

                    <div className="flex flex-1 flex-col overflow-hidden">
                      <h4 className="flex-1 truncate h5">{user.name}</h4>
                    </div>

                    {groupOption?.userId !== user.id && (
                      <Button
                        variant="outline"
                        disabled={isPending}
                        onClick={() => handleAddAdmin(user)}
                      >
                        {isPending && addedUserId.current === user.id && (
                          <LoaderIcon className="size-4 animate-spin" />
                        )}
                        {t("action")}
                      </Button>
                    )}
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        ) : (
          <div className="h-24 flex-center">
            <p className="">{t("empty")}</p>
          </div>
        )}
      </div>
    </RightPanelWrapper>
  )
}

export default AddGroupAdminsPanel
