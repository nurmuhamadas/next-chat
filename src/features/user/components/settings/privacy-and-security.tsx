import { ADD_TO_GROUP_OPT, TWO_FACTOR_AUTH_OPT } from "../../constants"
import useGetSetting from "../../hooks/api/use-get-setting"
import useUpdateSetting from "../../hooks/api/use-update-setting"

import SettingsContainer from "./container"
import SettingItem from "./item"

const PrivacyAndSecuritySettings = () => {
  const { data, refetch, isLoading } = useGetSetting()
  const { mutate: updateSetting, isPending } = useUpdateSetting()

  return (
    <SettingsContainer title="Privacy and Security">
      <SettingItem<boolean>
        title="Allow people to add me to the group"
        type="radio"
        options={ADD_TO_GROUP_OPT}
        value={data?.allowToAddToGroup ?? false}
        isLoading={isLoading || isPending}
        onValueChange={(value) => {
          updateSetting(
            { allowToAddToGroup: value },
            {
              onSuccess() {
                refetch()
              },
            },
          )
        }}
      />
      <SettingItem<boolean>
        title="Two Factor Authentication (2FA)"
        type="radio"
        options={TWO_FACTOR_AUTH_OPT}
        value={data?.enable2FA ?? false}
        isLoading={isLoading || isPending}
        onValueChange={(value) => {
          updateSetting(
            { enable2FA: value },
            {
              onSuccess() {
                refetch()
              },
            },
          )
        }}
      />
    </SettingsContainer>
  )
}

export default PrivacyAndSecuritySettings
