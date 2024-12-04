export const mapSettingModelToSetting = (setting: SettingAWModel): Setting => {
  return {
    id: setting.$id,
    userId: setting.userId,
    timeFormat: setting.timeFormat ?? null,
    language: setting.language ?? null,
    notifications: setting.notifications ?? null,
    enable2FA: setting.enable2FA ?? null,
    showLastSeen: setting.showLastSeen ?? null,
    allowToAddToGroup: setting.allowToAddToGroup ?? null,
  }
}
