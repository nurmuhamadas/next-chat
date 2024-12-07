import "server-only"

import { StatusCode } from "hono/utils/http-status"
import { Databases, ID, Query } from "node-appwrite"

import { ERROR } from "@/constants/error"
import { getBlockedUsers } from "@/features/blocked-users/lib/queries"
import { getUsers } from "@/features/user/lib/queries"
import {
  APPWRITE_GROUP_MEMBERS_ID,
  APPWRITE_GROUPS_ID,
  DATABASE_ID,
} from "@/lib/appwrite/config"
import { generateInviteCode } from "@/lib/utils"

import { GROUP_TYPE } from "../constants"

import { getGroupMembersByUserId } from "./group-member-queries"
import { mapUserModelToGroupOwner } from "./utils"

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

export const validateGroupData = async (
  databases: Databases,
  userId: string,
  data: { memberIds: string[] },
): Promise<
  | undefined
  | {
      error: string
      path?: (string | number)[]
      code: StatusCode
    }
> => {
  const { memberIds } = data

  // // USER SHOULD NOT CREATE TWO OR MORE GROUPS WITH SAME NAME
  // const isNameAvailable = await checkGroupNameAvailablity(databases, {
  //   userId,
  //   name,
  // })
  // if (!isNameAvailable) {
  //   return { error: ERROR.GROUP_NAME_DUPLICATED, code: 400 }
  // }

  // USER SHOULD ADD REGISTERED USER ONLY
  const validUsers = await getUsers(databases, {
    queries: [Query.equal("$id", memberIds), Query.notEqual("$id", userId)],
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
      Query.equal("blockedUserId", memberIds),
    ],
  })
  if (blockedUsers.total > 0) {
    return { error: ERROR.ADD_BLOCKED_USERS_NOT_ALLOWED, code: 403 }
  }

  // USER SHOULD NOT ADD BLOCKED USER AS MEMBER
  const blockedByUsers = await getBlockedUsers(databases, {
    queries: [
      Query.equal("userId", memberIds),
      Query.equal("blockedUserId", userId),
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
    const members = await getGroupMembersByUserId(databases, { userId })
    const groupIds = members.data.map((v) => v.groupId)

    const groups = await databases.listDocuments<GroupAWModel>(
      DATABASE_ID,
      APPWRITE_GROUPS_ID,
      [Query.equal("$id", groupIds)],
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
): Promise<QueryResults<GroupOwner>> => {
  const result = await getUsers(databases, {
    queries: [
      Query.equal("$id", userIds),
      Query.select(["$id", "firstName", "lastName", "imageUrl"]),
    ],
  })

  return {
    total: result.total,
    data: result.documents.map(mapUserModelToGroupOwner),
  }
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

export const searchGroup = async (
  databases: Databases,
  userId: string,
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
    Query.offset(offset),
    Query.select(["$id", "name", "imageUrl"]),
  ]

  if (query) {
    queries.push(Query.search("name", query))
  }

  if (limit > 0) {
    queries.push(Query.limit(limit))
  }

  try {
    const memberOfGroups = await databases.listDocuments<GroupMemberAWModel>(
      DATABASE_ID,
      APPWRITE_GROUP_MEMBERS_ID,
      [
        Query.equal("userId", userId),
        Query.isNull("leftAt"),
        Query.select(["groupId"]),
      ],
    )
    const memberGroupIds = memberOfGroups.documents.map((v) => v.groupId)
    if (memberOfGroups.total === 0) {
      queries.push(Query.equal("type", GROUP_TYPE.PUBLIC))
    } else {
      queries.push(
        Query.or([
          Query.equal("type", GROUP_TYPE.PUBLIC),
          Query.equal("$id", memberGroupIds),
        ]),
      )
    }

    const result = await databases.listDocuments<GroupAWModel>(
      DATABASE_ID,
      APPWRITE_GROUPS_ID,
      [
        ...queries,
        Query.or([
          Query.equal("type", GROUP_TYPE.PUBLIC),
          Query.equal("$id", memberGroupIds),
        ]),
      ],
    )
    const groupIds = result.documents.map((v) => v.$id)

    const memberResult = await databases.listDocuments<GroupMemberAWModel>(
      DATABASE_ID,
      APPWRITE_GROUP_MEMBERS_ID,
      [
        Query.equal("groupId", groupIds),
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
