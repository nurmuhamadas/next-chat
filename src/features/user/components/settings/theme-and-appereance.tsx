import { Separator } from "@/components/ui/separator"

import { LANGUAGE_OPT, THEME_OPT, TIME_FORMAT_OPT } from "../../constants"

import SettingsContainer from "./container"
import SettingItem from "./item"

const ThemeAndAppereanceSettings = () => {
  return (
    <SettingsContainer title="Themes and Appearance">
      <SettingItem
        title="Theme Mode"
        type="radio"
        options={THEME_OPT}
        value="DARK"
        onValueChange={() => {}}
      />
      <Separator />
      <SettingItem
        title="Time Format"
        type="radio"
        options={TIME_FORMAT_OPT}
        value="12-HOURS"
        onValueChange={() => {}}
      />
      <Separator />
      <SettingItem
        title="Language"
        type="radio"
        options={LANGUAGE_OPT}
        value="EN"
        onValueChange={() => {}}
      />
    </SettingsContainer>
  )
}

export default ThemeAndAppereanceSettings
