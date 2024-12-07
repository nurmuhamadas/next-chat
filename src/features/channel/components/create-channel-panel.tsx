import { useQueryClient } from "@tanstack/react-query"

import LeftPanelWrapper from "@/components/left-panel-wrapper"

import useCreateChannel from "../hooks/api/use-create-channel"
import { useCreateChannelPanel } from "../hooks/use-create-channel-modal"

import ChannelForm from "./channel-form"

const CreateChannelPanel = () => {
  const queryClient = useQueryClient()

  const { isCreateChannelOpen, closeCreateChannel } = useCreateChannelPanel()

  const { mutate: createChannel, isPending } = useCreateChannel()

  return (
    <LeftPanelWrapper
      title="New Channel"
      isOpen={isCreateChannelOpen}
      onBack={closeCreateChannel}
    >
      <div className="flex flex-col px-4 pb-8 pt-4">
        <ChannelForm
          isLoading={isPending}
          onSubmit={(form) => {
            createChannel(
              { form },
              {
                onSuccess() {
                  closeCreateChannel()
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

export default CreateChannelPanel
