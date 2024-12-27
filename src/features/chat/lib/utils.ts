import {
  Channel as ChannelModel,
  ChannelSubscriber as ChannelSubscriberModel,
  Group as GroupModel,
  GroupMember as GroupMemberModel,
  Message as MessageModel,
  Profile as ProfileModel,
  Room as RoomModel,
  UserUnreadMessage as UserUnreadMessageModel,
} from "@prisma/client"

export const getRoomIncludeQuery = ({ userId }: { userId: string }) => ({
  lastMessage: {
    select: {
      id: true,
      message: true,
      createdAt: true,
      sender: { select: { profile: { select: { name: true } } } },
    },
  },
  privateChat: {
    select: {
      user1: {
        select: {
          id: true,
          profile: { select: { name: true, imageUrl: true } },
        },
      },
      user2: {
        select: {
          id: true,
          profile: { select: { name: true, imageUrl: true } },
        },
      },
    },
  },
  group: {
    select: {
      name: true,
      imageUrl: true,
      members: {
        where: { userId, leftAt: null },
        select: { id: true },
      },
    },
  },
  channel: {
    select: {
      name: true,
      imageUrl: true,
      subscribers: {
        where: { userId, unsubscribedAt: null },
        select: { id: true },
      },
    },
  },
  unreadMessage: { select: { count: true } },
})

export const mapRoomModelToRoom = (
  room: RoomModel & {
    lastMessage:
      | (Pick<MessageModel, "id" | "message" | "createdAt"> & {
          sender: { profile: Pick<ProfileModel, "name"> | null }
        })
      | null
    privateChat: {
      user1: {
        id: string
        profile: Pick<ProfileModel, "name" | "imageUrl"> | null
      }
      user2: {
        id: string
        profile: Pick<ProfileModel, "name" | "imageUrl"> | null
      }
    } | null
    group:
      | (Pick<GroupModel, "name" | "imageUrl"> & {
          members: Pick<GroupMemberModel, "id">[]
        })
      | null
    channel:
      | (Pick<ChannelModel, "name" | "imageUrl"> & {
          subscribers: Pick<ChannelSubscriberModel, "id">[]
        })
      | null
    unreadMessage: Pick<UserUnreadMessageModel, "count"> | null
  },
): Room => {
  let id = ""
  let name = ""
  let imageUrl: string | null = null

  if (room.type === "PRIVATE") {
    const user =
      room.privateChat?.user1.id === room.ownerId
        ? room.privateChat?.user2
        : room.privateChat?.user1
    id = user?.id ?? ""
    if (room.privateChat?.user2.id === room.privateChat?.user1.id) {
      name = "Saved Messages"
    } else {
      name = user?.profile?.name ?? "Unknown"
    }
    imageUrl = user?.profile?.imageUrl ?? null
  } else if (room.type === "GROUP") {
    id = room.groupId!
    name = room.group?.name ?? "Group"
    imageUrl = room.group?.imageUrl ?? null
  } else {
    id = room.channelId!
    name = room.channel?.name ?? "Channel"
    imageUrl = room.channel?.imageUrl ?? null
  }

  return {
    id,
    name,
    imageUrl,
    lastMessage: room.lastMessage
      ? {
          id: room.lastMessage.id,
          message: room.lastMessage.message,
          sender: room.lastMessage.sender.profile?.name ?? "Unknown",
          time: room.lastMessage.createdAt?.toISOString(),
        }
      : null,
    totalUnreadMessages: room.unreadMessage?.count ?? 0,
    type:
      room.type === "PRIVATE"
        ? "chat"
        : room.type === "GROUP"
          ? "group"
          : "channel",
    pinned: !!room.pinnedAt,
    archived: !!room.archivedAt,
    isActive:
      room.type === "GROUP"
        ? room.group
          ? room.group.members.length > 0
          : false
        : room.type === "CHANNEL"
          ? room.channel
            ? room.channel.subscribers.length > 0
            : false
          : false,
  }
}

export const mapRoomModelToUserSearch = (
  room: RoomModel & {
    privateChat: {
      user1: {
        id: string
        profile: Pick<ProfileModel, "name" | "imageUrl" | "lastSeenAt"> | null
      }
      user2: {
        id: string
        profile: Pick<ProfileModel, "name" | "imageUrl" | "lastSeenAt"> | null
      }
    } | null
  },
): UserSearch => {
  let id = ""
  let name = ""
  let imageUrl: string | null = null
  let lastSeenAt: string | null = null

  const user =
    room.privateChat?.user1.id === room.ownerId
      ? room.privateChat?.user2
      : room.privateChat?.user1
  id = user?.id ?? ""
  if (room.privateChat?.user2.id === room.privateChat?.user1.id) {
    name = "Saved Messages"
  } else {
    name = user?.profile?.name ?? "Unknown"
    lastSeenAt = user?.profile?.lastSeenAt?.toISOString() ?? null
  }

  imageUrl = user?.profile?.imageUrl ?? null

  return {
    id,
    name,
    imageUrl,
    lastSeenAt,
  }
}
