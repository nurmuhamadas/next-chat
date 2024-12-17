import { Setting as SettingModel } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export const createSetting = (userId: string) => {
  return prisma.setting.create({
    data: {
      userId,
      language: "en_US",
      timeFormat: "HALF_DAY",
      notifications: ["CHANNEL", "GROUP", "PRIVATE"],
      allowAddToGroup: false,
      enable2FA: false,
      showLastSeen: true,
    },
  })
}

export const updateSetting = (
  id: string,
  data: Partial<Omit<SettingModel, "userId" | "id">>,
) => {
  return prisma.setting.update({
    where: { id },
    data: {
      language: data.language,
      timeFormat: data.timeFormat,
      notifications: data.notifications,
      allowAddToGroup: data.allowAddToGroup,
      enable2FA: data.enable2FA,
      showLastSeen: data.showLastSeen,
    },
  })
}
