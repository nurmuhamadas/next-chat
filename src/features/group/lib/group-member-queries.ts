import { prisma } from "@/lib/prisma"

export const joinGroup = ({
  userId,
  groupId,
}: {
  userId: string
  groupId: string
}) => {
  return prisma.$transaction([
    prisma.groupMember.create({
      data: { groupId, userId, isAdmin: false },
    }),
    prisma.groupOption.create({
      data: { groupId, userId, notification: true },
    }),
  ])
}

export const leaveGroup = ({
  memberId,
  userId,
  groupId,
}: {
  memberId: string
  userId: string
  groupId: string
}) => {
  return prisma.$transaction([
    prisma.groupMember.update({
      where: { id: memberId },
      data: { leftAt: new Date(), isAdmin: false },
    }),
    prisma.groupOption.deleteMany({
      where: { groupId, userId },
    }),
  ])
}

export const addGroupAdmin = ({ memberId }: { memberId: string }) => {
  return prisma.groupMember.update({
    where: { id: memberId },
    data: { isAdmin: true },
  })
}

export const removeGroupAdmin = ({ memberId }: { memberId: string }) => {
  return prisma.groupMember.update({
    where: { id: memberId },
    data: { isAdmin: false },
  })
}

export const clearAllChat = ({
  userId,
  groupId,
  isAdmin,
}: {
  userId: string
  groupId: string
  isAdmin: boolean
}) => {
  return prisma.$transaction([
    prisma.groupMember.deleteMany({ where: { userId, groupId } }),
    prisma.groupMember.create({
      data: { userId, groupId, isAdmin },
    }),
  ])
}
