import LeftPanelWrapper from "@/components/left-panel-wrapper"

import { useCreateChannelPanel } from "../hooks/use-create-channel-modal"

import ChannelForm from "./channel-form"

const CreateChannelPanel = () => {
  const { isCreateChannelOpen, closeCreateChannel } = useCreateChannelPanel()

  return (
    <LeftPanelWrapper
      title="New Channel"
      isOpen={isCreateChannelOpen}
      onBack={closeCreateChannel}
    >
      <div className="flex flex-col px-4 pb-8 pt-4">
        <ChannelForm />
      </div>
    </LeftPanelWrapper>
  )
}

export default CreateChannelPanel
