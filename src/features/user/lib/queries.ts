import { prisma } from "@/lib/prisma"

export const getProfileByUserId = (userId: string) => {
  return prisma.profile.findUnique({
    where: { userId },
  })
}
