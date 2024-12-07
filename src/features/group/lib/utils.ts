import { mergeName } from "@/lib/utils"

export const mapGroupModelToGroup = (
  group: GroupAWModel,
  owner: GroupOwner,
  totalMembers: number,
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
    totalMembers,
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

export const mapGroupOptModelToGroupOpt = (
  option: GroupOptionAWModel,
): GroupOption => {
  return {
    id: option.$id,
    groupId: option.groupId,
    notification: option.notification,
  }
}
