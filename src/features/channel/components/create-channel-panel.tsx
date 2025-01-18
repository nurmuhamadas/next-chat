import { useState } from "react"

import { useQueryClient } from "@tanstack/react-query"

import LeftPanelWrapper from "@/components/left-panel-wrapper"
import { useScopedI18n } from "@/lib/locale/client"

import useCreateChannel from "../hooks/api/use-create-channel"
import { useCreateChannelPanel } from "../hooks/use-create-channel-modal"

import ChannelForm from "./channel-form"

const CreateChannelPanel = () => {
  const queryClient = useQueryClient()

  const t = useScopedI18n("channel")

  const { isCreateChannelOpen, closeCreateChannel } = useCreateChannelPanel()

  const [errorMessage, setErrorMessage] = useState("")

  const { mutate: createChannel, isPending } = useCreateChannel()

  return (
    <LeftPanelWrapper
      title={t("new.title")}
      isOpen={isCreateChannelOpen}
      onBack={closeCreateChannel}
    >
      <div className="flex flex-col px-4 pb-8 pt-4">
        <ChannelForm
          isLoading={isPending}
          errorMessage={errorMessage}
          onClearError={() => setErrorMessage("")}
          onSubmit={(form) => {
            createChannel(form, {
              onSuccess() {
                closeCreateChannel()
                queryClient.invalidateQueries({ queryKey: ["rooms", 20] })
              },
              onError(error) {
                setErrorMessage(error.message)
              },
            })
          }}
        />
      </div>
    </LeftPanelWrapper>
  )
}

export default CreateChannelPanel
