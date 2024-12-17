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
