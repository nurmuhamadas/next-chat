import LeftPanelWrapper from "@/components/left-panel-wrapper"

import { useEditMyProfilePanel } from "../hooks/use-edit-my-profile-panel"

import ProfileForm from "./profile-form"

const EditMyProfilePanel = () => {
  const { isEditMyProfileOpen, closeEditMyProfile } = useEditMyProfilePanel()

  return (
    <LeftPanelWrapper
      title="Edit My Profile"
      isOpen={isEditMyProfileOpen}
      onBack={closeEditMyProfile}
    >
      <div className="flex flex-col px-4 pb-8 pt-4">
        <ProfileForm onSubmit={() => {}} />
      </div>
    </LeftPanelWrapper>
  )
}

export default EditMyProfilePanel
