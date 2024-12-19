import {
  Channel as ChannelModel,
  Group as GroupModel,
  Message as MessageModel,
  Profile as ProfileModel,
  Room as RoomModel,
} from "@prisma/client"

export const getRoomIncludeQuery = () => ({
  lastMessage: {
    select: {
      id: true,
      message: true,
      createdAt: true,
      sender: { select: { profile: { select: { name: true } } } },
    },
  },
  userPair: {
    select: { profile: { select: { name: true, imageUrl: true } } },
  },
  group: { select: { name: true, imageUrl: true } },
  channel: { select: { name: true, imageUrl: true } },
})

export const mapRoomModelToConversation = (
  room: RoomModel & {
    lastMessage:
      | (Pick<MessageModel, "id" | "message" | "createdAt"> & {
          sender: { profile: Pick<ProfileModel, "name"> | null }
        })
      | null
    userPair: { profile: Pick<ProfileModel, "name" | "imageUrl"> | null } | null
    group: Pick<GroupModel, "name" | "imageUrl"> | null
    channel: Pick<ChannelModel, "name" | "imageUrl"> | null
  },
): Conversation => {
  let id = ""
  let name = ""
  let imageUrl: string | null = null

  if (room.type === "PRIVATE") {
    id = room.userPairId!
    name = room.userPair?.profile?.name ?? "Unknown"
    imageUrl = room.userPair?.profile?.imageUrl ?? null
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
    totalUnreadMessages: 0,
    type:
      room.type === "PRIVATE"
        ? "chat"
        : room.type === "GROUP"
          ? "group"
          : "channel",
    pinned: !!room.pinnedAt,
    archived: !!room.archivedAt,
  }
}
