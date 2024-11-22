import { ADD_TO_GROUP_OPT, TWO_FACTOR_AUTH_OPT } from "../../constants"

import SettingsContainer from "./container"
import SettingItem from "./item"

const PrivacyAndSecuritySettings = () => {
  return (
    <SettingsContainer title="Privacy and Security">
      <SettingItem<boolean>
        title="Allow people to add me to the group"
        type="radio"
        options={ADD_TO_GROUP_OPT}
        value={false}
        onValueChange={() => {}}
      />
      <SettingItem<boolean>
        title="Two Factor Authentication (2FA)"
        type="radio"
        options={TWO_FACTOR_AUTH_OPT}
        value={false}
        onValueChange={() => {}}
      />
    </SettingsContainer>
  )
}

export default PrivacyAndSecuritySettings
