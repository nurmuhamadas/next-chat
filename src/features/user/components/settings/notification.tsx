import { NOTIFICATION_OPT } from "../../constants"
import useGetSetting from "../../../settings/hooks/use-get-setting"
import useUpdateSetting from "../../../settings/hooks/use-update-setting"

import SettingsContainer from "./container"
import SettingItem from "./item"

const NotificationSettings = () => {
  const { data, refetch, isLoading } = useGetSetting()
  const { mutate: updateSetting, isPending } = useUpdateSetting()

  return (
    <SettingsContainer title="Notifications">
      <SettingItem<NotificationType>
        title="Allow Notification"
        type="checkbox"
        options={NOTIFICATION_OPT}
        value={data?.notifications ?? []}
        isLoading={isLoading || isPending}
        onValueChange={(value) => {
          updateSetting(
            { notifications: value as NotificationType[] },
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

export default NotificationSettings
