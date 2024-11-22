import LeftPanelWrapper from "@/components/left-panel-wrapper"

import { useCreateGroupPanel } from "../hooks/use-create-group-panel"

import GroupForm from "./group-form"

const CreateGroupPanel = () => {
  const { isCreateGroupOpen, closeCreateGroup } = useCreateGroupPanel()

  return (
    <LeftPanelWrapper
      title="New Group"
      isOpen={isCreateGroupOpen}
      onBack={closeCreateGroup}
    >
      <div className="flex flex-col px-4 pb-8 pt-4">
        <GroupForm />
      </div>
    </LeftPanelWrapper>
  )
}

export default CreateGroupPanel
