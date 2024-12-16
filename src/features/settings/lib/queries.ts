import { prisma } from "@/lib/prisma"

export const getSettingByUserId = (id: string) => {
  return prisma.setting.findUnique({
    where: { userId: id },
  })
}
