import { useRef } from "react"

import { LoaderIcon, UserPlusIcon } from "lucide-react"

import ChatAvatar from "@/components/chat-avatar"
import RightPanelWrapper from "@/components/right-panel-wrapper"
import SimpleTooltip from "@/components/simple-tooltip"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRoomId } from "@/hooks/use-room-id"
import { useScopedI18n } from "@/lib/locale/client"
import { cn } from "@/lib/utils"

import useGetGroupById from "../hooks/api/use-get-group-by-id"
import useGetGroupMembers from "../hooks/api/use-get-group-members"
import useGetGroupOption from "../hooks/api/use-get-group-option"
import useRemoveGroupAdmin from "../hooks/api/use-remove-group-admin"
import { useAddGroupAdminPanel } from "../hooks/use-add-group-admin-panel"
import { useGroupAdminsPanel } from "../hooks/use-group-admins-panel"

const GroupAdminsPanel = () => {
  const t = useScopedI18n("group")

  const id = useRoomId()

  const removeUserId = useRef<string | null>(null)

  const { isGroupAdminsOpen, closeGroupAdmins } = useGroupAdminsPanel()
  const { openAddGroupAdmin } = useAddGroupAdminPanel()

  const { mutate: removeAdmin, isPending } = useRemoveGroupAdmin()

  const {
    data: members,
    isLoading: loadingMember,
    refetch: refetchMembers,
  } = useGetGroupMembers({
    groupId: isGroupAdminsOpen ? id : undefined,
  })
  const { data: group, isLoading: loadingGroup } = useGetGroupById({
    id: isGroupAdminsOpen ? id : undefined,
  })
  const { data: groupOption, isLoading: loadingOption } = useGetGroupOption({
    groupId: isGroupAdminsOpen ? id : undefined,
  })

  const isLoading = loadingMember || loadingGroup || loadingOption
  const admins = members.filter((member) => member.isAdmin)

  const handleRemoveAdmin = (user: GroupMember) => {
    if (isPending) return

    removeUserId.current = user.id
    removeAdmin(
      { groupId: id, userId: user.id },
      {
        onSuccess() {
          refetchMembers()
        },
        onSettled() {
          removeUserId.current = null
        },
      },
    )
  }

  return (
    <RightPanelWrapper
      title={t("admin.title")}
      isOpen={isGroupAdminsOpen}
      onBack={closeGroupAdmins}
      action={
        <SimpleTooltip content={t("tooltip.add_admins")}>
          <Button variant="icon" size="icon" onClick={openAddGroupAdmin}>
            <UserPlusIcon />
          </Button>
        </SimpleTooltip>
      }
    >
      <div className="flex flex-col gap-y-6 px-4 pb-8 pt-4">
        <p className="text-muted-foreground body-2">{t("admin.info")}</p>
        {isLoading ? (
          <div className="h-24 flex-center">
            <LoaderIcon className="size-5 animate-spin" />
          </div>
        ) : group?.isAdmin ? (
          <ScrollArea className="chat-list-scroll-area">
            <ul className="flex flex-col">
              {admins.map((user) => {
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
                        onClick={() => handleRemoveAdmin(user)}
                      >
                        {isPending && removeUserId.current === user.id && (
                          <LoaderIcon className="size-4 animate-spin" />
                        )}
                        {t("admin.remove")}
                      </Button>
                    )}
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        ) : (
          <></>
        )}
      </div>
    </RightPanelWrapper>
  )
}

export default GroupAdminsPanel
