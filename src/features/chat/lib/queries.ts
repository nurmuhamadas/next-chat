import { RoomType } from "@prisma/client"

import { prisma } from "@/lib/prisma"

export const pinRoom = (id: string) => {
  return prisma.room.update({
    where: { id },
    data: { pinnedAt: new Date(), archivedAt: null },
  })
}

export const unpinRoom = (id: string) => {
  return prisma.room.update({
    where: { id },
    data: { pinnedAt: null },
  })
}

export const archiveRoom = (id: string) => {
  return prisma.room.update({
    where: { id },
    data: { archivedAt: new Date(), pinnedAt: null },
  })
}

export const unarchiveRoom = (id: string) => {
  return prisma.room.update({
    where: { id },
    data: { archivedAt: null },
  })
}

export const deleteRoom = ({
  id,
  type,
  ownerId,
  privateChatId,
  groupId,
  channelId,
}: {
  id: string
  type: RoomType
  ownerId: string
  privateChatId: string
  groupId: string
  channelId: string
}) => {
  return prisma.$transaction(async (tx) => {
    if (type === "PRIVATE") {
      await tx.privateChatOption.deleteMany({
        where: { privateChatId, userId: ownerId },
      })
    } else if (type === "GROUP") {
      await tx.groupMember.deleteMany({ where: { userId: ownerId, groupId } })
      await tx.groupOption.deleteMany({ where: { userId: ownerId, groupId } })
    } else if (type === "CHANNEL") {
      await tx.channelSubscriber.deleteMany({
        where: { userId: ownerId, channelId },
      })
      await tx.channelOption.deleteMany({
        where: { userId: ownerId, channelId },
      })
    }

    await tx.room.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  })
}
