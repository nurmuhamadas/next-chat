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

export const getGroupIncludeQuery = ({ userId }: { userId: string }) => {
  return {
    members: {
      where: { userId, leftAt: null },
      select: { isAdmin: true },
    },
    _count: {
      select: { members: { where: { leftAt: null } } },
    },
  }
}

export const mapGroupModelToGroup = (
  group: GroupModel & {
    members: Pick<GroupMemberModel, "isAdmin">[]
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
    isMember: group.members.length > 0,
    isAdmin: group.members[0]?.isAdmin ?? false,
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
    totalMembers: group._count.members,
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
    userId: groupOption.userId,
    groupId: groupOption.groupId,
    notification: groupOption.notification,
  }
}
