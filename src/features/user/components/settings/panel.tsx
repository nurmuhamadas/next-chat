import LeftPanelWrapper from "@/components/left-panel-wrapper"
import { useScopedI18n } from "@/lib/locale/client"

import { useSettingsPanel } from "../../hooks/use-settings-panel"

import NotificationSettings from "./notification"
import PrivacyAndSecuritySettings from "./privacy-and-security"
import ThemeAndAppereanceSettings from "./theme-and-appereance"

const SettingsPanel = () => {
  const t = useScopedI18n("settings")

  const { isSettingsOpen, closeSettings } = useSettingsPanel()

  return (
    <LeftPanelWrapper
      isOpen={isSettingsOpen}
      onBack={closeSettings}
      title={t("title")}
    >
      <div className="flex min-h-screen flex-col gap-y-4 border-r-8 border-surface bg-background py-4">
        <ThemeAndAppereanceSettings />
        <NotificationSettings />
        <PrivacyAndSecuritySettings />
      </div>
    </LeftPanelWrapper>
  )
}

export default SettingsPanel
