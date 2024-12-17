import { prisma } from "@/lib/prisma"

export const getBlockedUsers = ({
  userId,
  limit,
  cursor,
}: {
  userId: string
  limit: number
  cursor?: string
}) => {
  return prisma.blockedUser.findMany({
    where: { userId, unblockedAt: { equals: null } },
    select: {
      id: true,
      blockedUser: {
        select: {
          id: true,
          profile: { select: { name: true, imageUrl: true } },
        },
      },
    },
    take: limit,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : undefined,
  })
}

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
