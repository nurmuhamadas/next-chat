import RightPanelWrapper from "@/components/right-panel-wrapper"

import { useEditGroupPanel } from "../hooks/use-edit-group-panel"

import GroupForm from "./group-form"

const EditGroupPanel = () => {
  const { isEditGroupOpen, closeEditGroup } = useEditGroupPanel()

  return (
    <RightPanelWrapper
      title="Edit Group"
      isOpen={isEditGroupOpen}
      onBack={closeEditGroup}
    >
      <div className="flex flex-col px-4 pb-8 pt-4">
        <GroupForm />
      </div>
    </RightPanelWrapper>
  )
}

export default EditGroupPanel
