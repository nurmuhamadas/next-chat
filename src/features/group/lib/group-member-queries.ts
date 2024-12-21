import { prisma } from "@/lib/prisma"

export const joinGroup = async ({
  userId,
  groupId,
}: {
  userId: string
  groupId: string
}) => {
  const currentRoom = await prisma.room.findFirst({
    where: { groupId, ownerId: userId, deletedAt: null },
  })
  return prisma.$transaction([
    prisma.room.upsert({
      where: { id: currentRoom?.id ?? "" },
      create: {
        groupId,
        ownerId: userId,
        type: "GROUP",
        unreadMessage: {
          create: { count: 0, userId },
        },
      },
      update: {
        deletedAt: null,
        unreadMessage: {
          create: { count: 0, userId },
        },
      },
    }),
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
    prisma.userUnreadMessage.deleteMany({
      where: { userId, room: { groupId } },
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
    prisma.userUnreadMessage.updateMany({
      where: { userId, room: { groupId } },
      data: { count: 0 },
    }),
  ])
}
