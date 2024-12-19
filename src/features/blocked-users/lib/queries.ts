import { prisma } from "@/lib/prisma"

export const blockUser = ({
  userId,
  blockedUserId,
}: {
  userId: string
  blockedUserId: string
}) => {
  return prisma.blockedUser.create({
    data: { userId, blockedUserId },
  })
}

export const unblockUser = ({
  userId,
  blockedUserId,
}: {
  userId: string
  blockedUserId: string
}) => {
  return prisma.blockedUser.updateMany({
    where: { userId, blockedUserId, unblockedAt: { equals: null } },
    data: { unblockedAt: new Date() },
  })
}
