import { UserSquare2Icon } from "lucide-react"

import Loading from "@/components/loader"
import RightPanelWrapper from "@/components/right-panel-wrapper"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"
import { useScopedI18n } from "@/lib/locale/client"

import useGetGroupById from "../hooks/api/use-get-group-by-id"
import useGetGroupMembers from "../hooks/api/use-get-group-members"
import useUpdateGroup from "../hooks/api/use-update-group"
import { useEditGroupPanel } from "../hooks/use-edit-group-panel"
import { useGroupAdminsPanel } from "../hooks/use-group-admins-panel"

import GroupForm from "./group-form"

const EditGroupPanel = () => {
  const t = useScopedI18n("group")

  const type = useRoomType()
  const id = useRoomId()

  const { isEditGroupOpen, closeEditGroup } = useEditGroupPanel()
  const { openGroupAdmins } = useGroupAdminsPanel()

  const { mutate: updateGroup, isPending } = useUpdateGroup()
  const {
    data: group,
    isLoading: isDataLoading,
    refetch,
  } = useGetGroupById({
    id: isEditGroupOpen && type === "group" ? id : undefined,
  })

  const isGroupAdmin = group?.isAdmin ?? false
  const isLoading = isDataLoading

  const { data: members, isLoading: loadingMembers } = useGetGroupMembers({
    groupId: isEditGroupOpen && type === "group" ? id : undefined,
  })
  const admins = members.filter((member) => member.isAdmin)

  return (
    <RightPanelWrapper
      title={t("edit.title")}
      isOpen={isEditGroupOpen}
      onBack={closeEditGroup}
    >
      <div className="flex flex-col px-4 pb-8 pt-4">
        {isLoading ? (
          <Loading />
        ) : isGroupAdmin ? (
          <>
            <GroupForm
              initialImageUrl={group?.imageUrl ?? ""}
              initialValues={{
                name: group?.name,
                type: group?.type,
                description: group?.description ?? "",
              }}
              isLoading={isPending}
              onSubmit={(form) => {
                updateGroup(
                  { data: form, groupId: id },
                  {
                    onSuccess() {
                      refetch()
                      closeEditGroup()
                    },
                  },
                )
              }}
            />
            <Separator className="mb-6 mt-8" />
            <ul className="">
              <li className="">
                <button
                  className="flex w-full items-center gap-x-5 rounded px-1.5 py-3 hover:bg-grey-4 focus:outline-none"
                  onClick={openGroupAdmins}
                >
                  <UserSquare2Icon className="size-7 shrink-0 text-grey-3" />
                  <div className="flex flex-1 flex-col overflow-hidden text-left">
                    {loadingMembers ? (
                      <>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="mt-1 h-4 w-1/2" />
                      </>
                    ) : (
                      <>
                        <div className="subtitle-1">{t("admin.title")}</div>
                        <p className="text-muted-foreground body-2">
                          {admins.length}
                        </p>
                      </>
                    )}
                  </div>
                </button>
              </li>
            </ul>
          </>
        ) : null}
      </div>
    </RightPanelWrapper>
  )
}

export default EditGroupPanel
