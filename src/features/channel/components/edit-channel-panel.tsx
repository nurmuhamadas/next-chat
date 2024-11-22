import RightPanelWrapper from "@/components/right-panel-wrapper"
import { useEditChannelPanel } from "@/features/group/hooks/use-edit-channel-panel"

import ChannelForm from "./channel-form"

const EditChannelPanel = () => {
  const { isEditChannelOpen, closeEditChannel } = useEditChannelPanel()

  return (
    <RightPanelWrapper
      title="Edit Channel"
      isOpen={isEditChannelOpen}
      onBack={closeEditChannel}
    >
      <div className="flex flex-col px-4 pb-8 pt-4">
        <ChannelForm />
      </div>
    </RightPanelWrapper>
  )
}

export default EditChannelPanel
