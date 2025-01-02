/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTheme } from "next-themes"

import { Separator } from "@/components/ui/separator"
import {
  LANGUAGE_OPT,
  THEME_OPT,
  TIME_FORMAT_OPT,
} from "@/features/user/constants"
import {
  useChangeLocale,
  useCurrentLocale,
  useScopedI18n,
} from "@/lib/locale/client"

import useGetSetting from "../../hooks/api/use-get-setting"
import useUpdateSetting from "../../hooks/api/use-update-setting"

import SettingsContainer from "./container"
import SettingItem from "./item"

const ThemeAndAppereanceSettings = () => {
  const t = useScopedI18n("settings.appearance")

  const currentLocale = useCurrentLocale()
  const currentLang = currentLocale === "en" ? "en_US" : "id_ID"

  const changeLocale = useChangeLocale()

  const { setTheme, theme, systemTheme } = useTheme()

  const { data, isLoading, refetch } = useGetSetting()
  const { mutate: updateSetting, isPending } = useUpdateSetting()

  const handleLanguageChange = (value: Language) => {
    if (value === "en_US") {
      changeLocale("en")
    } else {
      changeLocale("id")
    }
  }

  const handleThemeChange = (value: Theme) => {
    if (value === "SYSTEM") {
      setTheme(systemTheme ?? "light")
    } else {
      setTheme(value.toLowerCase())
    }
  }

  return (
    <SettingsContainer title={t("title")}>
      <SettingItem
        title={t("theme_mode")}
        type="radio"
        options={THEME_OPT.map((opt) => ({
          ...opt,
          label: t(opt.label as any),
        }))}
        value={theme?.toUpperCase()}
        isLoading={isLoading || isPending}
        onValueChange={handleThemeChange}
      />
      <Separator />
      <SettingItem
        title={t("time_format")}
        type="radio"
        options={TIME_FORMAT_OPT.map((opt) => ({
          ...opt,
          label: t(opt.label as any),
        }))}
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
        title={t("language")}
        type="radio"
        options={LANGUAGE_OPT.map((opt) => ({
          ...opt,
          label: t(opt.label as any),
        }))}
        value={currentLang}
        isLoading={isLoading || isPending}
        onValueChange={handleLanguageChange}
      />
    </SettingsContainer>
  )
}

export default ThemeAndAppereanceSettings
