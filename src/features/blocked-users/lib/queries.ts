import "server-only"

import { Databases, ID, Models, Query } from "node-appwrite"

import { getUsers } from "@/features/user/lib/queries"
import { APPWRITE_BLOCKED_USERS_ID, DATABASE_ID } from "@/lib/appwrite/config"

export type BlockedUserResult = Pick<
  UserAWModel,
  "$id" | "firstName" | "lastName" | "imageUrl"
>

export const getBlockedUsersByUserId = async (
  databases: Databases,
  { userId }: { userId: string },
): Promise<Models.DocumentList<BlockedUserResult & Models.Document>> => {
  try {
    const result = await databases.listDocuments<BlockedUserAWModel>(
      DATABASE_ID,
      APPWRITE_BLOCKED_USERS_ID,
      [Query.equal("userId", userId)],
    )

    if (result.total === 0) {
      return {
        total: 0,
        documents: [],
      }
    }

    const blockedUserIds = result.documents.map((v) => v.blockedUserId)
    const blockedResult = await getUsers(databases, {
      queries: [
        Query.contains("$id", blockedUserIds),
        Query.select(["$id", "firstName", "lastName", "imageUrl"]),
      ],
    })

    return blockedResult
  } catch {
    return {
      total: 0,
      documents: [],
    }
  }
}

export const getBlockedUsers = async (
  databases: Databases,
  { queries }: { queries: string[] },
): Promise<Models.DocumentList<BlockedUserResult & Models.Document>> => {
  try {
    const result = await databases.listDocuments<BlockedUserAWModel>(
      DATABASE_ID,
      APPWRITE_BLOCKED_USERS_ID,
      queries,
    )

    if (result.total === 0) {
      return {
        total: 0,
        documents: [],
      }
    }

    const blockedUserIds = result.documents.map((v) => v.blockedUserId)
    const blockedResult = await getUsers(databases, {
      queries: [
        Query.contains("$id", blockedUserIds),
        Query.select(["$id", "firstName", "lastName", "imageUrl"]),
      ],
    })

    return blockedResult
  } catch {
    return {
      total: 0,
      documents: [],
    }
  }
}

export const getBlockedUser = async (
  databases: Databases,
  data: BlockedUserModel,
) => {
  try {
    const result = await databases.listDocuments<BlockedUserAWModel>(
      DATABASE_ID,
      APPWRITE_BLOCKED_USERS_ID,
      [
        Query.or([
          Query.equal("userId", data.userId),
          Query.equal("blockedUserId", data.blockedUserId),
        ]),
      ],
    )

    if (result.total === 0) return null

    return result.documents[0]
  } catch {
    return null
  }
}

export const blockUser = async (
  databases: Databases,
  data: BlockedUserModel,
) => {
  return await databases.createDocument<BlockedUserAWModel>(
    DATABASE_ID,
    APPWRITE_BLOCKED_USERS_ID,
    ID.unique(),
    data,
  )
}

export const unblockUser = async (
  databases: Databases,
  { id }: { id: string },
) => {
  await databases.deleteDocument(DATABASE_ID, APPWRITE_BLOCKED_USERS_ID, id)
}

export const validateBlockedEach = async (
  databases: Databases,
  { userId1, userId2 }: { userId1: string; userId2: string },
) => {
  const result = await databases.listDocuments(
    DATABASE_ID,
    APPWRITE_BLOCKED_USERS_ID,
    [
      Query.or([
        Query.and([
          Query.equal("userId", userId1),
          Query.equal("blockedUserId", userId2),
        ]),
        Query.and([
          Query.equal("userId", userId2),
          Query.equal("blockedUserId", userId1),
        ]),
      ]),
    ],
  )

  return result.total > 0
}
