import { useQueryClient } from "@tanstack/react-query"

import LeftPanelWrapper from "@/components/left-panel-wrapper"

import useCreateGroup from "../hooks/api/use-create-group"
import { useCreateGroupPanel } from "../hooks/use-create-group-panel"

import GroupForm from "./group-form"

const CreateGroupPanel = () => {
  const queryClient = useQueryClient()

  const { isCreateGroupOpen, closeCreateGroup } = useCreateGroupPanel()

  const { mutate: createGroup, isPending } = useCreateGroup()

  return (
    <LeftPanelWrapper
      title="New Group"
      isOpen={isCreateGroupOpen}
      onBack={closeCreateGroup}
    >
      <div className="flex flex-col px-4 pb-8 pt-4">
        <GroupForm
          isLoading={isPending}
          onSubmit={(form) => {
            createGroup(
              { form },
              {
                onSuccess() {
                  closeCreateGroup()
                  queryClient.invalidateQueries({ queryKey: ["conversations"] })
                },
              },
            )
          }}
        />
      </div>
    </LeftPanelWrapper>
  )
}

export default CreateGroupPanel
