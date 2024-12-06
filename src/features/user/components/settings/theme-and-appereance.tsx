import { useTheme } from "next-themes"

import { Separator } from "@/components/ui/separator"
import {
  LANGUAGE_OPT,
  THEME_OPT,
  TIME_FORMAT_OPT,
} from "@/features/user/constants"

import useGetSetting from "../../hooks/api/use-get-setting"
import useUpdateSetting from "../../hooks/api/use-update-setting"

import SettingsContainer from "./container"
import SettingItem from "./item"

const ThemeAndAppereanceSettings = () => {
  const { setTheme, theme, systemTheme } = useTheme()

  const { data, isLoading, refetch } = useGetSetting()
  const { mutate: updateSetting, isPending } = useUpdateSetting()

  const handleThemeChange = (value: Theme) => {
    if (value === "SYSTEM") {
      setTheme(systemTheme ?? "light")
    } else {
      setTheme(value.toLowerCase())
    }
  }

  return (
    <SettingsContainer title="Themes and Appearance">
      <SettingItem
        title="Theme Mode"
        type="radio"
        options={THEME_OPT}
        value={theme?.toUpperCase()}
        isLoading={isLoading || isPending}
        onValueChange={handleThemeChange}
      />
      <Separator />
      <SettingItem
        title="Time Format"
        type="radio"
        options={TIME_FORMAT_OPT}
        value={data?.timeFormat}
        isLoading={isLoading || isPending}
        onValueChange={(value) => {
          updateSetting(
            { json: { timeFormat: value as TimeFormat } },
            {
              onSuccess() {
                refetch()
              },
            },
          )
        }}
      />
      <Separator />
      <SettingItem
        title="Language"
        type="radio"
        options={LANGUAGE_OPT}
        value={data?.language}
        isLoading={isLoading || isPending}
        onValueChange={(value) => {
          updateSetting(
            { json: { language: value as Language } },
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

export default ThemeAndAppereanceSettings
