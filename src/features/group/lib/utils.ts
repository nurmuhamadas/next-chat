import { mergeName } from "@/lib/utils"

export const mapGroupModelToGroup = (
  group: GroupAWModel,
  owner: GroupOwner,
  lastMessage?: LastMessage,
): Group => {
  return {
    id: group.$id,
    name: group.name,
    description: group.description ?? null,
    imageUrl: group.imageUrl ?? null,
    owner,
    type: group.type,
    inviteCode: group.inviteCode,
    lastMessage: lastMessage ?? null,
  }
}

export const mapUserModelToGroupOwner = (user: UserAWModel): GroupOwner => {
  return {
    id: user.$id,
    name: mergeName(user.firstName, user.lastName),
    imageUrl: user.imageUrl ?? null,
  }
}

export const mapGroupMemberModelToGroupMember = (
  member: GroupMemberAWModel,
  user: UserAWModel,
): GroupMember => {
  return {
    id: user.$id,
    name: mergeName(user.firstName, user.lastName),
    imageUrl: user.imageUrl ?? null,
    isAdmin: member.isAdmin,
    lastSeenAt: user.lastSeenAt ?? null,
  }
}
