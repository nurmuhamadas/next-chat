import {
  MessageStatus,
  Notification,
  PrismaClient,
  RoomType,
} from "@prisma/client"
import { addMinutes } from "date-fns"
import { generate } from "random-words"

import { hashPassword } from "@/features/auth/lib/utils"

import { channels, groups, users } from "./data"

const prisma = new PrismaClient()

async function main() {
  await prisma.$executeRaw`TRUNCATE TABLE users CASCADE`

  // ========= === >>> USERS <<< === =========
  const password1 = await hashPassword("Password123")
  const password2 = await hashPassword("123Pass321Word")
  const usersResult = await prisma.user.createManyAndReturn({
    data: [
      ...users.map((user) => ({
        username: user.username,
        email: user.email,
        password: ["john_doe", "jane_doe"].includes(user.username)
          ? password1
          : password2,
        emailVerifiedAt: new Date(),
      })),
    ],
    select: { id: true, username: true },
  })

  const profiles = users.map((user) => ({
    ...user.profile,
    userId: usersResult.find((u) => u.username === user.username)?.id ?? "",
  }))
  await prisma.profile.createMany({
    data: [
      ...profiles.map((profile) => ({
        ...profile,
      })),
    ],
  })

  await prisma.setting.createMany({
    data: [
      ...usersResult.map((user) => ({
        userId: user.id,
        notifications: [
          Notification.PRIVATE,
          Notification.GROUP,
          Notification.CHANNEL,
        ],
      })),
    ],
  })
  // ========= === >>> END USERS <<< === =========

  // ========= === >>> PRIVATE CHATS <<< === =========
  const userIdsCombination = usersResult.flatMap((user1, index1) => {
    return usersResult.slice(index1 + 1).map((user2) => [user1.id, user2.id])
  })

  const privateChats = await prisma.privateChat.createManyAndReturn({
    data: [
      ...userIdsCombination.map((userIds) => ({
        user1Id: userIds[0],
        user2Id: userIds[1],
      })),
    ],
    select: { id: true, user1Id: true, user2Id: true },
  })

  await prisma.privateChatOption.createMany({
    data: [
      ...privateChats.map((chat) => ({
        userId: chat.user1Id,
        privateChatId: chat.id,
        notification: true,
      })),
      ...privateChats.map((chat) => ({
        userId: chat.user2Id,
        privateChatId: chat.id,
        notification: true,
      })),
    ],
  })
  // ========= === >>> END PRIVATE CHATS <<< === =========

  // ========= === >>> GROUPS <<< === =========
  const groupsResult = await prisma.group.createManyAndReturn({
    data: [
      ...groups.map((group, i) => ({
        ...group,
        ownerId: usersResult[i].id,
      })),
    ],
    select: { id: true, ownerId: true },
  })

  const groupMembers: { groupId: string; userId: string; isAdmin: boolean }[] =
    []
  for (const group of groupsResult) {
    const userIds: string[] = []
    for (let i = 0; i < Math.floor(Math.random() * (7 - 4 + 1) + 4); i++) {
      const userId =
        usersResult[Math.floor(Math.random() * usersResult.length)].id
      if (!userIds.includes(userId)) {
        userIds.push(userId)
      }
    }
    groupMembers.push(
      ...userIds.map((userId) => ({
        groupId: group.id,
        userId,
        isAdmin:
          group.ownerId === userId || userId === userIds[userIds.length - 1],
      })),
    )
  }

  await prisma.groupMember.createMany({
    data: [
      ...groupMembers.map((groupMember) => ({
        ...groupMember,
      })),
    ],
  })

  await prisma.groupOption.createMany({
    data: [
      ...groupMembers.map((groupMember) => ({
        groupId: groupMember.groupId,
        userId: groupMember.userId,
        notification: true,
      })),
    ],
  })
  // ========= === >>> END GROUPS <<< === =========

  // ========= === >>> CHANNELS <<< === =========
  const channelsResult = await prisma.channel.createManyAndReturn({
    data: [
      ...channels.map((channel, i) => ({
        ...channel,
        ownerId: usersResult[i].id,
      })),
    ],
    select: { id: true, ownerId: true },
  })

  const channelSubs = []
  for (const channel of channelsResult) {
    const userIds: string[] = []
    for (let i = 0; i < Math.floor(Math.random() * (7 - 4 + 1) + 4); i++) {
      const userId =
        usersResult[Math.floor(Math.random() * usersResult.length)].id
      if (!userIds.includes(userId)) {
        userIds.push(userId)
      }
    }
    channelSubs.push(
      ...userIds.map((userId) => ({
        channelId: channel.id,
        userId,
        isAdmin:
          channel.ownerId === userId || userId === userIds[userIds.length - 1],
      })),
    )
  }

  await prisma.channelSubscriber.createMany({
    data: [
      ...channelSubs.map((channelSub) => ({
        ...channelSub,
      })),
    ],
  })

  await prisma.channelOption.createMany({
    data: [
      ...channelSubs.map((channelSub) => ({
        channelId: channelSub.channelId,
        userId: channelSub.userId,
        notification: true,
      })),
    ],
  })
  // ========= === >>> END CHANNELS <<< === =========

  // ========= === >>> ROOMS <<< === =========
  const rooms = await prisma.room.createManyAndReturn({
    data: [
      ...privateChats.map((chat) => ({
        ownerId: chat.user1Id,
        privateChatId: chat.id,
        type: RoomType.PRIVATE,
      })),
      ...privateChats.map((chat) => ({
        ownerId: chat.user2Id,
        privateChatId: chat.id,
        type: RoomType.PRIVATE,
      })),
      ...groupMembers.map((member) => ({
        ownerId: member.userId,
        groupId: member.groupId,
        type: RoomType.GROUP,
      })),
      ...channelSubs.map((subscriber) => ({
        ownerId: subscriber.userId,
        channelId: subscriber.channelId,
        type: RoomType.CHANNEL,
      })),
    ],
    select: { id: true, ownerId: true },
  })
  // ========= === >>> END ROOMS <<< === =========

  // ========= === >>> MESSAGES <<< === =========
  const channelAdmins = channelSubs.filter((channelSub) => channelSub.isAdmin)
  const messages = await prisma.message.createManyAndReturn({
    data: [
      ...Array.from({ length: 7 })
        .map(() => privateChats)
        .flat()
        .map((chat) => {
          const time = addMinutes(new Date(), Math.random() * 10).toISOString()
          return {
            senderId: chat.user1Id,
            message: (
              generate({
                min: 3,
                minLength: 4,
                max: 10,
                maxLength: 20,
              }) as string[]
            ).join(" "),
            privateChatId: chat.id,
            isEmojiOnly: false,
            status: MessageStatus.DEFAULT,
            createdAt: time,
            updatedAt: time,
          }
        }),
      ...Array.from({ length: 8 })
        .map(() => privateChats)
        .flat()
        .map((chat) => {
          const time = addMinutes(new Date(), Math.random() * 10).toISOString()
          return {
            senderId: chat.user2Id,
            message: (
              generate({
                min: 3,
                minLength: 4,
                max: 10,
                maxLength: 20,
              }) as string[]
            ).join(" "),
            privateChatId: chat.id,
            isEmojiOnly: false,
            status: MessageStatus.DEFAULT,
            createdAt: time,
            updatedAt: time,
          }
        }),
      ...Array.from({ length: 3 })
        .map(() => groupMembers)
        .flat()
        .map((member) => {
          const time = addMinutes(new Date(), Math.random() * 10).toISOString()
          return {
            senderId: member.userId,
            message: (
              generate({
                min: 3,
                minLength: 4,
                max: 10,
                maxLength: 20,
              }) as string[]
            ).join(" "),
            groupId: member.groupId,
            isEmojiOnly: false,
            status: MessageStatus.DEFAULT,
            createdAt: time,
            updatedAt: time,
          }
        }),
      ...Array.from({ length: 5 })
        .map(() => channelAdmins)
        .flat()
        .map((member) => {
          const time = addMinutes(new Date(), Math.random() * 10).toISOString()
          return {
            senderId: member.userId,
            message: (
              generate({
                min: 3,
                minLength: 10,
                max: 10,
                maxLength: 30,
              }) as string[]
            ).join(" "),
            channelId: member.channelId,
            isEmojiOnly: false,
            status: MessageStatus.DEFAULT,
            createdAt: time,
            updatedAt: time,
          }
        }),
    ],
    select: {
      id: true,
      groupId: true,
      privateChatId: true,
      channelId: true,
      createdAt: true,
    },
  })
  // ========= === >>> END MESSAGES <<< === =========

  // ========= === >>> UNREAD MESSAGES <<< === =========
  await prisma.userUnreadMessage.createMany({
    data: [
      ...rooms.map((room) => ({
        userId: room.ownerId,
        roomId: room.id,
        count: 0,
      })),
    ],
  })
  // ========= === >>> END UNREAD MESSAGES <<< === =========

  // ========= === >>> UPDATE ROOM LAST MESSAGE <<< === =========
  const orderedMessages = messages.sort((a, b) =>
    b.createdAt.toISOString().localeCompare(a.createdAt.toISOString()),
  )
  for (const chat of privateChats) {
    const lastMessage = orderedMessages.find(
      (message) => message.privateChatId === chat.id,
    )
    if (lastMessage) {
      await prisma.room.updateMany({
        data: { lastMessageId: lastMessage.id },
        where: { privateChatId: chat.id },
      })
    }
  }
  for (const group of groupsResult) {
    const lastMessage = orderedMessages.find(
      (message) => message.groupId === group.id,
    )
    if (lastMessage) {
      await prisma.room.updateMany({
        data: { lastMessageId: lastMessage.id },
        where: { groupId: group.id },
      })
    }
  }
  for (const channel of channelsResult) {
    const lastMessage = orderedMessages.find(
      (message) => message.channelId === channel.id,
    )
    if (lastMessage) {
      await prisma.room.updateMany({
        data: { lastMessageId: lastMessage.id },
        where: { channelId: channel.id },
      })
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
