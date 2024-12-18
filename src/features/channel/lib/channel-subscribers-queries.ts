import { prisma } from "@/lib/prisma"

export const subscribeChannel = ({
  userId,
  channelId,
}: {
  userId: string
  channelId: string
}) => {
  return prisma.$transaction([
    prisma.channelSubscriber.create({
      data: { channelId, userId, isAdmin: false },
    }),
    prisma.channelOption.create({
      data: { channelId, userId, notification: true },
    }),
  ])
}

export const unSubscribeChannel = ({
  subscriberId,
  userId,
  channelId,
}: {
  subscriberId: string
  userId: string
  channelId: string
}) => {
  return prisma.$transaction([
    prisma.channelSubscriber.update({
      where: { id: subscriberId },
      data: { unsubscribedAt: new Date(), isAdmin: false },
    }),
    prisma.channelOption.deleteMany({
      where: { channelId, userId },
    }),
  ])
}

export const addChannelAdmin = ({ subscriberId }: { subscriberId: string }) => {
  return prisma.channelSubscriber.update({
    where: { id: subscriberId },
    data: { isAdmin: true },
  })
}

export const removeChannelAdmin = ({
  subscriberId,
}: {
  subscriberId: string
}) => {
  return prisma.channelSubscriber.update({
    where: { id: subscriberId },
    data: { isAdmin: false },
  })
}

export const clearAllChannelChat = ({
  userId,
  channelId,
  isAdmin,
}: {
  userId: string
  channelId: string
  isAdmin: boolean
}) => {
  return prisma.$transaction([
    prisma.channelSubscriber.deleteMany({ where: { userId, channelId } }),
    prisma.channelSubscriber.create({
      data: { userId, channelId, isAdmin },
    }),
  ])
}
