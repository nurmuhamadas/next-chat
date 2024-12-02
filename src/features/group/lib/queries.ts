import "server-only"

import { StatusCode } from "hono/utils/http-status"
import { Databases, ID, Query } from "node-appwrite"
import { z } from "zod"

import { ERROR } from "@/constants/error"
import { getBlockedUsers } from "@/features/blocked-users/lib/queries"
import { getUsers } from "@/features/user/lib/queries"
import {
  APPWRITE_GROUP_MEMBERS_ID,
  APPWRITE_GROUP_OPTIONS_ID,
  APPWRITE_GROUPS_ID,
  DATABASE_ID,
} from "@/lib/appwrite/config"
import { generateInviteCode } from "@/lib/utils"

import { groupSchema } from "../schema"

import {
  mapGroupMemberModelToGroupMember,
  mapUserModelToGroupOwner,
} from "./utils"

export const checkGroupNameAvailablity = async (
  databases: Databases,
  { userId, name }: { userId: string; name: string },
) => {
  const result = await databases.listDocuments(
    DATABASE_ID,
    APPWRITE_GROUPS_ID,
    [Query.equal("ownerId", userId), Query.equal("name", name)],
  )

  return result.total === 0
}

export const createGroupInviteCode = async (databases: Databases) => {
  let isExist = true
  let inviteCode = generateInviteCode(10)
  while (isExist) {
    const result = await databases.listDocuments(
      DATABASE_ID,
      APPWRITE_GROUPS_ID,
      [Query.equal("inviteCode", inviteCode)],
    )
    isExist = result.total > 0
    if (isExist) {
      inviteCode = generateInviteCode(10)
    }
  }

  return inviteCode
}

export const createGroup = async (
  databases: Databases,
  formData: GroupModel,
) => {
  return await databases.createDocument<GroupAWModel>(
    DATABASE_ID,
    APPWRITE_GROUPS_ID,
    ID.unique(),
    formData,
  )
}

export const createGroupOption = async (
  databases: Databases,
  formData: GroupOptionModel,
) => {
  return await databases.createDocument<GroupOptionAWModel>(
    DATABASE_ID,
    APPWRITE_GROUP_OPTIONS_ID,
    ID.unique(),
    formData,
  )
}

export const createGroupMember = async (
  databases: Databases,
  data: GroupMemberModel,
) => {
  return await databases.createDocument<GroupMemberAWModel>(
    DATABASE_ID,
    APPWRITE_GROUP_MEMBERS_ID,
    ID.unique(),
    data,
  )
}

export const validateGroupData = async (
  databases: Databases,
  userId: string,
  data: z.infer<typeof groupSchema>,
): Promise<
  | undefined
  | {
      error: string
      path?: (string | number)[]
      code: StatusCode
    }
> => {
  const { name, memberIds } = data

  // USER SHOULD NOT CREATE TWO OR MORE GROUPS WITH SAME NAME
  const isNameAvailable = await checkGroupNameAvailablity(databases, {
    userId,
    name,
  })
  if (!isNameAvailable) {
    return { error: ERROR.GROUP_NAME_DUPLICATED, code: 400 }
  }

  // USER SHOULD ADD REGISTERED USER ONLY
  const validUsers = await getUsers(databases, {
    queries: [Query.contains("$id", memberIds), Query.notEqual("$id", userId)],
  })
  if (validUsers.total < memberIds.length) {
    const validUserIds = validUsers.documents.map((v) => v.$id)
    const notValidUserId = memberIds.find((id) => !validUserIds.includes(id))
    return {
      error: ERROR.MEMBER_ID_NOT_FOUND,
      path: ["members", notValidUserId!],
      code: 400,
    }
  }

  // USER SHOULD NOT ADD BLOCKED USER AS MEMBER
  const blockedUsers = await getBlockedUsers(databases, {
    queries: [
      Query.equal("userId", userId),
      Query.contains("blockedUserId", memberIds),
    ],
  })
  if (blockedUsers.total > 0) {
    return { error: ERROR.ADD_BLOCKED_USERS_NOT_ALLOWED, code: 403 }
  }

  // USER SHOULD NOT ADD BLOCKED USER AS MEMBER
  const blockedByUsers = await getBlockedUsers(databases, {
    queries: [
      Query.contains("userId", memberIds),
      Query.contains("blockedUserId", userId),
    ],
  })
  if (blockedByUsers.total > 0) {
    return { error: ERROR.ADDDED_BY_BLOCKED_USER_NOT_ALLOWED, code: 403 }
  }

  return undefined
}

export const getGroupsByUserId = async (
  databases: Databases,
  { userId }: { userId: string },
) => {
  try {
    const members = await databases.listDocuments<GroupMemberAWModel>(
      DATABASE_ID,
      APPWRITE_GROUP_MEMBERS_ID,
      [Query.equal("userId", userId), Query.isNull("leftAt")],
    )
    const groupIds = members.documents.map((v) => v.groupId)

    const groups = await databases.listDocuments<GroupAWModel>(
      DATABASE_ID,
      APPWRITE_GROUPS_ID,
      [Query.contains("$id", groupIds)],
    )

    return groups
  } catch {
    return {
      total: 0,
      documents: [],
    }
  }
}

export const getGroupOwnersByUserIds = async (
  databases: Databases,
  { userIds }: { userIds: string[] },
) => {
  const result = await getUsers(databases, {
    queries: [
      Query.contains("$id", userIds),
      Query.select(["$id", "firstName", "lastName", "imageUrl"]),
    ],
  })

  return result.documents.map(mapUserModelToGroupOwner)
}

export const getGroupById = async (
  databases: Databases,
  { id }: { id: string },
) => {
  try {
    return await databases.getDocument<GroupAWModel>(
      DATABASE_ID,
      APPWRITE_GROUPS_ID,
      id,
    )
  } catch {
    return null
  }
}

export const validateGroupMember = async (
  databases: Databases,
  { userId, groupId }: { userId: string; groupId: string },
) => {
  const result = await databases.listDocuments<GroupMemberAWModel>(
    DATABASE_ID,
    APPWRITE_GROUP_MEMBERS_ID,
    [
      Query.equal("userId", userId),
      Query.equal("groupId", groupId),
      Query.isNull("leftAt"),
    ],
  )

  return result.total > 0
}

export const getGroupMembers = async (
  databases: Databases,
  { groupId }: { groupId: string },
) => {
  try {
    const result = await databases.listDocuments<GroupMemberAWModel>(
      DATABASE_ID,
      APPWRITE_GROUP_MEMBERS_ID,
      [Query.equal("groupId", groupId)],
    )
    const memberIds = result.documents.map((v) => v.userId)

    const memberProfiles = await getUsers(databases, {
      queries: [
        Query.contains("$id", memberIds),
        Query.select([
          "$id",
          "firstName",
          "lastName",
          "imageUrl",
          "lastSeenAt",
        ]),
      ],
    })
    const memberProfileIds = memberProfiles.documents.map((v) => v.$id)

    const members = result.documents
      .filter((member) => memberProfileIds.includes(member.userId))
      .map((member) => {
        const profile = memberProfiles.documents.find(
          (v) => v.$id === member.userId,
        )
        return mapGroupMemberModelToGroupMember(member, profile!)
      })

    return {
      total: members.length,
      documents: members,
    }
  } catch {
    return {
      total: 0,
      documents: [],
    }
  }
}

export const searchGroup = async (
  databases: Databases,
  {
    query,
    limit,
    offset,
  }: { query?: string; limit: number; offset: number } = {
    limit: 20,
    offset: 0,
  },
): Promise<QueryResults<GroupSearch>> => {
  const queries = [
    Query.limit(limit),
    Query.offset(offset),
    Query.select(["$id", "name", "imageUrl"]),
  ]

  if (query) {
    queries.push(Query.search("name", query))
  }

  try {
    const result = await databases.listDocuments<GroupAWModel>(
      DATABASE_ID,
      APPWRITE_GROUPS_ID,
      queries,
    )
    const groupIds = result.documents.map((v) => v.$id)

    const memberResult = await databases.listDocuments<GroupMemberAWModel>(
      DATABASE_ID,
      APPWRITE_GROUP_MEMBERS_ID,
      [
        Query.contains("groupId", groupIds),
        Query.isNull("leftAt"),
        Query.select(["groupId"]),
      ],
    )

    const searchResult: GroupSearch[] = result.documents.map((group) => ({
      id: group.$id,
      name: group.name,
      imageUrl: group.imageUrl,
      totalMember:
        memberResult.documents.filter((member) => member.groupId === group.$id)
          .length ?? 0,
    }))

    return {
      total: result.total,
      data: searchResult,
    }
  } catch {
    return {
      total: 0,
      data: [],
    }
  }
}

export const validateJoinCode = async (
  databases: Databases,
  { groupId, code }: { groupId: string; code: string },
) => {
  const result = await databases.getDocument<GroupAWModel>(
    DATABASE_ID,
    APPWRITE_GROUPS_ID,
    groupId,
    [Query.select(["inviteCode"])],
  )

  return result.inviteCode === code
}

export const leftGroupMember = async (
  databases: Databases,
  { groupId, userId }: { groupId: string; userId: string },
) => {
  const result = await databases.listDocuments(
    DATABASE_ID,
    APPWRITE_GROUP_MEMBERS_ID,
    [
      Query.equal("groupId", groupId),
      Query.equal("userId", userId),
      Query.isNull("leftAt"),
    ],
  )

  return await databases.updateDocument<GroupMemberAWModel>(
    DATABASE_ID,
    APPWRITE_GROUP_MEMBERS_ID,
    result.documents[0]?.$id,
    {
      leftAt: new Date(),
    },
  )
}
