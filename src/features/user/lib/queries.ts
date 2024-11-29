import { Databases, Models, Query } from "node-appwrite"

import { APPWRITE_USERS_ID, DATABASE_ID } from "@/lib/appwrite/config"

export const checkUsernameIsExist = async (
  databases: Databases,
  username: string,
) => {
  const result = await databases.listDocuments(DATABASE_ID, APPWRITE_USERS_ID, [
    Query.equal("username", username),
  ])

  return result.total > 0
}

export const getUserProfileById = async (
  databases: Databases,
  userId: string,
) => {
  try {
    return await databases.getDocument<UserModel>(
      DATABASE_ID,
      APPWRITE_USERS_ID,
      userId,
    )
  } catch {
    return null
  }
}

export type SearchUserQueryResult = Pick<
  UserModel,
  "firstName" | "lastName" | "imageUrl" | "lastSeenAt"
> &
  AppwriteDocument

export const searchUser = async (
  databases: Databases,
  { query, limit, offset }: { query?: string; limit: number; offset: number },
): Promise<Models.DocumentList<SearchUserQueryResult>> => {
  const queries = [
    Query.limit(limit),
    Query.offset(offset),
    Query.select(["$id", "firstName", "lastName", "imageUrl", "lastSeenAt"]),
  ]

  if (query) {
    queries.push(
      Query.or([
        Query.search("firstName", query),
        Query.search("lastName", query),
        Query.search("username", query),
      ]),
    )
  }

  try {
    return await databases.listDocuments<UserModel>(
      DATABASE_ID,
      APPWRITE_USERS_ID,
      queries,
    )
  } catch {
    return {
      total: 0,
      documents: [],
    }
  }
}

export const getUsers = async (
  databases: Databases,
  queries: string[] = [],
) => {
  try {
    return await databases.listDocuments<UserModel>(
      DATABASE_ID,
      APPWRITE_USERS_ID,
      queries,
    )
  } catch {
    return {
      total: 0,
      documents: [],
    }
  }
}
