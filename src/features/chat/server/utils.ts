import { mergeName } from "@/lib/utils"

export const mapUserModelToConversation = (
  conversation: ConversationAWModel,
  user: UserAWModel,
  lastMessage?: LastMessage,
  totalUnreadMessages?: number,
): Conversation => {
  return {
    id: conversation.$id,
    roomId: user.$id,
    name: mergeName(user.firstName, user.lastName),
    imageUrl: user.imageUrl ?? null,
    type: "chat",
    lastMessage: lastMessage ?? null,
    totalUnreadMessages: totalUnreadMessages ?? 0,
  }
}

export const mapGroupModelToConversation = (
  group: GroupAWModel,
  lastMessage?: LastMessage,
  totalUnreadMessages?: number,
): Conversation => {
  return {
    id: group.$id,
    roomId: group.$id,
    name: group.name,
    imageUrl: group.imageUrl ?? null,
    type: "group",
    lastMessage: lastMessage ?? null,
    totalUnreadMessages: totalUnreadMessages ?? 0,
  }
}

export const mapChannelModelToConversation = (
  channel: ChannelAWModel,
  lastMessage?: LastMessage,
  totalUnreadMessages?: number,
): Conversation => {
  return {
    id: channel.$id,
    roomId: channel.$id,
    name: channel.name,
    imageUrl: channel.imageUrl ?? null,
    type: "channel",
    lastMessage: lastMessage ?? null,
    totalUnreadMessages: totalUnreadMessages ?? 0,
  }
}
