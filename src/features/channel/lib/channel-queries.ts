import { ChannelType } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import { generateInviteCode } from "@/lib/utils"

export const createChannelInviteCode = async () => {
  let isExist = true
  let inviteCode = generateInviteCode(10)
  while (isExist) {
    const result = await prisma.channel.findUnique({
      where: { inviteCode: inviteCode },
    })
    isExist = !!result
    if (isExist) {
      inviteCode = generateInviteCode(10)
    }
  }

  return inviteCode
}

export const createChannel = (data: {
  name: string
  type: ChannelType
  description?: string
  inviteCode: string
  imageUrl?: string
  ownerId: string
}) => {
  return prisma.channel.create({
    data: {
      name: data.name,
      type: data.type,
      inviteCode: data.inviteCode,
      description: data.description,
      imageUrl: data.imageUrl,
      ownerId: data.ownerId,
      subscribersOption: {
        create: {
          userId: data.ownerId,
          notification: true,
        },
      },
      subscribers: {
        create: {
          userId: data.ownerId,
          isAdmin: true,
        },
      },
      rooms: {
        create: {
          type: "CHANNEL",
          ownerId: data.ownerId,
        },
      },
    },
  })
}

export const updateChannel = (
  id: string,
  data: {
    name?: string
    type?: GroupType
    description?: string
    imageUrl?: string
  },
) => {
  return prisma.channel.update({
    where: { id },
    data: {
      name: data.name,
      type: data.type,
      description: data.description,
      imageUrl: data.imageUrl,
    },
    include: {
      _count: { select: { subscribers: { where: { unsubscribedAt: null } } } },
    },
  })
}

export const softDeleteChannel = (id: string) => {
  return prisma.channel.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      subscribers: {
        updateMany: [
          {
            where: { channelId: id },
            data: { isAdmin: false, unsubscribedAt: new Date() },
          },
        ],
      },
      subscribersOption: {
        deleteMany: [{ channelId: id }],
      },
    },
  })
}
