import { NOTIFICATION_OPT } from "../../constants"

import SettingsContainer from "./container"
import SettingItem from "./item"

const NotificationSettings = () => {
  return (
    <SettingsContainer title="Notifications">
      <SettingItem<RoomType>
        title="Allow Notification"
        type="checkbox"
        options={NOTIFICATION_OPT}
        value={["chat"]}
        onValueChange={() => {}}
      />
    </SettingsContainer>
  )
}

export default NotificationSettings
