import { useState } from "react"

import { useQueryClient } from "@tanstack/react-query"

import LeftPanelWrapper from "@/components/left-panel-wrapper"
import { useScopedI18n } from "@/lib/locale/client"

import useCreateGroup from "../hooks/api/use-create-group"
import { useCreateGroupPanel } from "../hooks/use-create-group-panel"

import GroupForm from "./group-form"

const CreateGroupPanel = () => {
  const queryClient = useQueryClient()

  const t = useScopedI18n("group")

  const { isCreateGroupOpen, closeCreateGroup } = useCreateGroupPanel()

  const [errorMessage, setErrorMessage] = useState("")

  const { mutate: createGroup, isPending } = useCreateGroup()

  return (
    <LeftPanelWrapper
      title={t("new.title")}
      isOpen={isCreateGroupOpen}
      onBack={closeCreateGroup}
    >
      <div className="flex flex-col px-4 pb-8 pt-4">
        <GroupForm
          isLoading={isPending}
          errorMessage={errorMessage}
          onClearError={() => setErrorMessage("")}
          onSubmit={(form) => {
            createGroup(
              { form },
              {
                onSuccess() {
                  closeCreateGroup()
                  queryClient.invalidateQueries({ queryKey: ["rooms"] })
                },
                onError(error) {
                  setErrorMessage(error.message)
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
