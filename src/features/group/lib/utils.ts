import {
  Group as GroupModel,
  GroupMember as GroupMemberModel,
  GroupOption as GroupOptionModel,
  GroupType,
  Profile,
} from "@prisma/client"

export const getGroupWhere = (groupId: string, userId: string) => ({
  id: groupId,
  OR: [
    {
      type: GroupType.PRIVATE,
      members: { some: { userId, leftAt: { equals: null } } },
    },
    { type: GroupType.PUBLIC },
  ],
  deletedAt: null,
})

export const mapGroupModelToGroup = (
  group: GroupModel & {
    _count: {
      members: number
    }
  },
): Group => {
  return {
    id: group.id,
    name: group.name,
    description: group.description ?? null,
    imageUrl: group.imageUrl ?? null,
    ownerId: group.ownerId,
    type: group.type,
    inviteCode: group.inviteCode,
    totalMembers: group._count.members,
  }
}

export const mapGroupModelToGroupSearch = (
  group: Pick<GroupModel, "id" | "name" | "imageUrl"> & {
    _count: {
      members: number
    }
  },
): GroupSearch => {
  return {
    id: group.id,
    name: group.name,
    imageUrl: group.imageUrl,
    totalMember: group._count.members,
  }
}

export const mapGroupMemberModelToGroupMember = (
  member: Pick<GroupMemberModel, "id" | "userId" | "isAdmin"> & {
    user: { profile: Pick<Profile, "name" | "imageUrl" | "lastSeenAt"> | null }
  },
): GroupMember => {
  return {
    id: member.userId,
    name: member.user.profile?.name ?? "User",
    imageUrl: member.user.profile?.imageUrl ?? null,
    isAdmin: member.isAdmin,
    lastSeenAt: member.user.profile?.lastSeenAt?.toISOString() ?? null,
  }
}

export const mapGroupOptionModelToOption = (
  groupOption: GroupOptionModel,
): GroupOption => {
  return {
    id: groupOption.id,
    groupId: groupOption.groupId,
    notification: groupOption.notification,
  }
}
