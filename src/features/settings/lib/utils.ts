import { Setting as SettingModel } from "@prisma/client"

export const mapSettingModelToSetting = (setting: SettingModel): Setting => {
  return {
    id: setting.id,
    userId: setting.userId,
    timeFormat: setting.timeFormat === "HALF_DAY" ? "12-HOUR" : "24-HOUR",
    language: setting.language,
    notifications: setting.notifications,
    enable2FA: setting.enable2FA,
    showLastSeen: setting.showLastSeen,
    allowToAddToGroup: setting.allowAddToGroup,
  }
}
