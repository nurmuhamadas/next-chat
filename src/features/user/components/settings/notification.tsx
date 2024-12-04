import { NOTIFICATION_OPT } from "../../constants"

import SettingsContainer from "./container"
import SettingItem from "./item"

const NotificationSettings = () => {
  return (
    <SettingsContainer title="Notifications">
      <SettingItem<NotificationType>
        title="Allow Notification"
        type="checkbox"
        options={NOTIFICATION_OPT}
        value={["PRIVATE"]}
        onValueChange={() => {}}
      />
    </SettingsContainer>
  )
}

export default NotificationSettings
