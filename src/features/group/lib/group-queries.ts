import { GroupType, RoomType } from "@prisma/client"
import { StatusCode } from "hono/utils/http-status"

import { ERROR } from "@/constants/error"
import { prisma } from "@/lib/prisma"
import { generateInviteCode } from "@/lib/utils"

export const validateGroupMember = async (
  userId: string,
  memberIds: string[],
): Promise<
  | undefined
  | {
      error: string
      path?: (string | number)[]
      code: StatusCode
    }
> => {
  // USER SHOULD ADD REGISTERED USER ONLY
  const validUsers = await prisma.user.findMany({
    where: {
      id: { in: memberIds, not: userId },
      profile: { isNot: null },
    },
    select: { id: true },
  })
  console.log(validUsers)
  if (validUsers.length < memberIds.length) {
    const validUserIds = validUsers.map((v) => v.id)
    const notValidUserId = memberIds.find((id) => !validUserIds.includes(id))
    return {
      error: ERROR.MEMBER_ID_NOT_FOUND,
      path: ["members", notValidUserId!],
      code: 400,
    }
  }

  // USER SHOULD NOT ADD BLOCKED USER AS MEMBER
  const blockedUsers = await prisma.blockedUser.findMany({
    where: {
      userId,
      blockedUserId: { in: memberIds },
      unblockedAt: { equals: null },
    },
  })
  if (blockedUsers.length > 0) {
    return { error: ERROR.ADD_BLOCKED_USERS_NOT_ALLOWED, code: 403 }
  }

  // USER SHOULD NOT ADD BLOCKED USER AS MEMBER
  const blockedByUsers = await await prisma.blockedUser.findMany({
    where: {
      userId: { in: memberIds },
      blockedUserId: userId,
      unblockedAt: { equals: null },
    },
  })
  if (blockedByUsers.length > 0) {
    return { error: ERROR.ADDDED_BY_BLOCKED_USER_NOT_ALLOWED, code: 403 }
  }

  return undefined
}

export const createGroupInviteCode = async () => {
  let isExist = true
  let inviteCode = generateInviteCode(10)
  while (isExist) {
    const result = await prisma.group.findUnique({
      where: { inviteCode: inviteCode },
    })
    isExist = !!result
    if (isExist) {
      inviteCode = generateInviteCode(10)
    }
  }

  return inviteCode
}

export const createGroup = (data: {
  name: string
  type: GroupType
  description?: string
  inviteCode: string
  imageUrl?: string
  ownerId: string
  memberIds: string[]
}) => {
  return prisma.$transaction(async (tx) => {
    const createdGroup = await tx.group.create({
      data: {
        name: data.name,
        type: data.type,
        inviteCode: data.inviteCode,
        description: data.description,
        imageUrl: data.imageUrl,
        ownerId: data.ownerId,
        membersOption: {
          createMany: {
            data: [
              {
                userId: data.ownerId,
                notification: true,
              },
              ...data.memberIds.map((id) => ({
                userId: id,
                notification: true,
              })),
            ],
          },
        },
        members: {
          createMany: {
            data: [
              {
                userId: data.ownerId,
                isAdmin: true,
              },
              ...data.memberIds.map((id) => ({
                userId: id,
                isAdmin: false,
              })),
            ],
          },
        },
        rooms: {
          createMany: {
            data: [
              {
                type: RoomType.GROUP,
                ownerId: data.ownerId,
              },
              ...data.memberIds.map((id) => ({
                type: RoomType.GROUP,
                ownerId: id,
              })),
            ],
          },
        },
      },
      include: { rooms: { select: { id: true, ownerId: true } } },
    })

    await tx.userUnreadMessage.createMany({
      data: createdGroup.rooms.map((room) => ({
        userId: room.ownerId,
        roomId: room.id,
        count: 0,
      })),
    })

    return createdGroup
  })
}

export const updateGroup = (
  id: string,
  data: {
    name?: string
    type?: GroupType
    description?: string
    imageUrl?: string
  },
) => {
  return prisma.group.update({
    where: { id },
    data: {
      name: data.name,
      type: data.type,
      description: data.description,
      imageUrl: data.imageUrl,
    },
    include: {
      _count: { select: { members: { where: { leftAt: null } } } },
    },
  })
}

export const softDeleteGroup = (id: string) => {
  return prisma.group.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      members: {
        updateMany: [
          {
            where: { groupId: id },
            data: { isAdmin: false, leftAt: new Date() },
          },
        ],
      },
      membersOption: {
        deleteMany: [{ groupId: id }],
      },
    },
  })
}
