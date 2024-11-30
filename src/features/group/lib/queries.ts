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
