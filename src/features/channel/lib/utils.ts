import { mergeName } from "@/lib/utils"

export const mapChannelModelToChannel = (
  channel: ChannelAWModel,
  owner: ChannelOwner,
  lastMessage?: LastMessage,
): Channel => {
  return {
    id: channel.$id,
    name: channel.name,
    description: channel.description ?? null,
    type: channel.type,
    imageUrl: channel.imageUrl ?? null,
    owner,
    inviteCode: channel.inviteCode,
    lastMessage: lastMessage ?? null,
  }
}

export const mapUserModelToChannelOwner = (user: UserAWModel): ChannelOwner => {
  return {
    id: user.$id,
    name: mergeName(user.firstName, user.lastName),
    imageUrl: user.imageUrl ?? null,
  }
}
