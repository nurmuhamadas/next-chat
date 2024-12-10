import Loading from "@/components/loader"
import RightPanelWrapper from "@/components/right-panel-wrapper"
import { useRoomId } from "@/hooks/use-room-id"
import { useRoomType } from "@/hooks/use-room-type"

import useGetGroupById from "../hooks/api/use-get-group-by-id"
import useGetIsGroupAdmin from "../hooks/api/use-get-is-group-admin"
import useUpdateGroup from "../hooks/api/use-update-group"
import { useEditGroupPanel } from "../hooks/use-edit-group-panel"

import GroupForm from "./group-form"

const EditGroupPanel = () => {
  const type = useRoomType()
  const id = useRoomId()

  const { isEditGroupOpen, closeEditGroup } = useEditGroupPanel()

  const { mutate: updateGroup, isPending } = useUpdateGroup()
  const {
    data: group,
    isLoading: isDataLoading,
    refetch,
  } = useGetGroupById({ id: type === "group" ? id : undefined })
  const { data: isGroupAdmin, isLoading: isAdminLoading } = useGetIsGroupAdmin({
    id: type === "group" ? id : undefined,
  })
  const isLoading = isAdminLoading || isDataLoading

  return (
    <RightPanelWrapper
      title="Edit Group"
      isOpen={isEditGroupOpen}
      onBack={closeEditGroup}
    >
      <div className="flex flex-col px-4 pb-8 pt-4">
        {isLoading ? (
          <Loading />
        ) : isGroupAdmin ? (
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
                { form, param: { groupId: id } },
                {
                  onSuccess() {
                    refetch()
                    closeEditGroup()
                  },
                },
              )
            }}
          />
        ) : null}
      </div>
    </RightPanelWrapper>
  )
}

export default EditGroupPanel
