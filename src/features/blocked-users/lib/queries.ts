import { Databases, ID, Models, Query } from "node-appwrite"

import { getUsers } from "@/features/user/lib/queries"
import { APPWRITE_BLOCKED_USERS_ID, DATABASE_ID } from "@/lib/appwrite/config"

export const getBlockedUsersByUserId = async (
  databases: Databases,
  userId: string,
): Promise<Models.DocumentList<UserModel>> => {
  try {
    const result = await databases.listDocuments<BlockedUserModel>(
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
    const blockedResult = await getUsers(databases, [
      Query.contains("$id", blockedUserIds),
      Query.select(["$id", "firstName", "lastName", "imageUrl"]),
    ])

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
  userId: string,
  blockedUserId: string,
) => {
  try {
    const result = await databases.listDocuments<BlockedUserModel>(
      DATABASE_ID,
      APPWRITE_BLOCKED_USERS_ID,
      [
        Query.or([
          Query.equal("userId", userId),
          Query.equal("blockedUserId", blockedUserId),
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
  userId: string,
  blockedUserId: string,
) => {
  try {
    return await databases.createDocument<BlockedUserModel>(
      DATABASE_ID,
      APPWRITE_BLOCKED_USERS_ID,
      ID.unique(),
      { blockedUserId, userId },
    )
  } catch {
    return null
  }
}

export const unblockUser = async (databases: Databases, id: string) => {
  try {
    await databases.deleteDocument(DATABASE_ID, APPWRITE_BLOCKED_USERS_ID, id)
  } catch {
    return null
  }
}
