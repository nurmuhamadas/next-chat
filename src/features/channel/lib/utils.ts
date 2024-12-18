import {
  Channel as ChannelModel,
  ChannelOption as ChannelOptionModel,
  ChannelSubscriber as ChannelSubscriberModel,
  ChannelType,
  Message as MessageModel,
  Profile as ProfileModel,
} from "@prisma/client"

export const getChannelWhere = (channelId: string, userId: string) => ({
  id: channelId,
  OR: [
    {
      type: ChannelType.PRIVATE,
      subscribers: { some: { userId, unsubscribedAt: null } },
    },
    { type: ChannelType.PUBLIC },
  ],
  deletedAt: null,
})

export const mapChannelModelToChannel = (
  channel: ChannelModel & {
    lastMessage?:
      | (Pick<MessageModel, "message" | "createdAt"> & {
          sender: { profile: Pick<ProfileModel, "name"> | null }
        })
      | null
    _count: {
      subscribers: number
    }
  },
): Channel => {
  return {
    id: channel.id,
    name: channel.name,
    description: channel.description ?? null,
    imageUrl: channel.imageUrl ?? null,
    ownerId: channel.ownerId,
    type: channel.type,
    inviteCode: channel.inviteCode,
    lastMessage:
      channel.lastMessageId && channel.lastMessage
        ? {
            id: channel.lastMessageId,
            sender: channel.lastMessage.sender.profile?.name ?? "User",
            message: channel.lastMessage.message,
            time: channel.lastMessage?.createdAt.toISOString(),
          }
        : null,
    totalSubscribers: channel._count.subscribers,
  }
}

export const mapChannelModelToChannelSearch = (
  channel: Pick<ChannelModel, "id" | "name" | "imageUrl"> & {
    _count: {
      subscribers: number
    }
  },
): ChannelSearch => {
  return {
    id: channel.id,
    name: channel.name,
    imageUrl: channel.imageUrl,
    totalSubscribers: channel._count.subscribers,
  }
}

export const mapChannelSubModelToChannelSub = (
  member: Pick<ChannelSubscriberModel, "id" | "userId" | "isAdmin"> & {
    user: {
      profile: Pick<ProfileModel, "name" | "imageUrl" | "lastSeenAt"> | null
    }
  },
): ChannelSubscriber => {
  return {
    id: member.userId,
    name: member.user.profile?.name ?? "User",
    imageUrl: member.user.profile?.imageUrl ?? null,
    isAdmin: member.isAdmin,
    lastSeenAt: member.user.profile?.lastSeenAt?.toISOString() ?? null,
  }
}

export const mapChannelOptionModelToOption = (
  channelOpt: ChannelOptionModel,
): ChannelOption => {
  return {
    id: channelOpt.id,
    channelId: channelOpt.channelId,
    notification: channelOpt.notification,
  }
}
