import LeftPanelWrapper from "@/components/left-panel-wrapper"
import Loading from "@/components/loader"
import { useScopedI18n } from "@/lib/locale/client"

import { useGetMyProfile } from "../hooks/api/use-get-my-profile"
import useUpdateProfile from "../hooks/api/use-update-profile"
import { useEditMyProfilePanel } from "../hooks/use-edit-my-profile-panel"

import ProfileForm from "./profile-form"

const EditMyProfilePanel = () => {
  const t = useScopedI18n("my_profile")

  const { isEditMyProfileOpen, closeEditMyProfile } = useEditMyProfilePanel()

  const { data, isLoading, refetch } = useGetMyProfile()
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  return (
    <LeftPanelWrapper
      title="Edit My Profile"
      isOpen={isEditMyProfileOpen}
      onBack={closeEditMyProfile}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col px-4 pb-8 pt-4">
          <ProfileForm
            initialValues={{
              name: data?.name ?? "",
              gender: data?.gender ?? "MALE",
              bio: data?.bio ?? "",
            }}
            initialImageUrl={data?.imageUrl ?? ""}
            isLoading={isPending}
            buttonLabel={t("edit_submit")}
            onSubmit={(values) => {
              updateProfile(values, {
                onSuccess() {
                  refetch()
                },
              })
            }}
          />
        </div>
      )}
    </LeftPanelWrapper>
  )
}

export default EditMyProfilePanel
