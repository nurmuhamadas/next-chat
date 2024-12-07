import "server-only"

import { Databases, ID, Query } from "node-appwrite"

import { APPWRITE_USERS_ID, DATABASE_ID } from "@/lib/appwrite/config"

export const checkUsernameIsExist = async (
  databases: Databases,
  { username, email }: { username: string; email: string },
) => {
  const result = await databases.listDocuments(DATABASE_ID, APPWRITE_USERS_ID, [
    Query.equal("username", username),
    Query.notEqual("email", email),
  ])

  return result.total === 0
}

export const createUserProfile = async (
  databases: Databases,
  form: UserModel,
) => {
  return await databases.createDocument<UserAWModel>(
    DATABASE_ID,
    APPWRITE_USERS_ID,
    ID.unique(),
    form,
  )
}

export const updateUserProfile = async (
  databases: Databases,
  id: string,
  form: Partial<UserModel>,
) => {
  return await databases.updateDocument<UserAWModel>(
    DATABASE_ID,
    APPWRITE_USERS_ID,
    id,
    form,
  )
}

export const getUserProfileById = async (
  databases: Databases,
  { userId }: { userId: string },
) => {
  try {
    return await databases.getDocument<UserAWModel>(
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
  {
    query,
    limit,
    offset,
    userId,
  }: { query?: string; limit: number; offset: number; userId: string },
) => {
  const queries = [
    Query.offset(offset),
    Query.select(["$id", "firstName", "lastName", "imageUrl", "lastSeenAt"]),
  ]

  if (limit > 0) {
    queries.push(Query.limit(limit))
  }

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
    return await databases.listDocuments<SearchUserQueryResult>(
      DATABASE_ID,
      APPWRITE_USERS_ID,
      [...queries, Query.notEqual("$id", userId)],
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
  { queries = [] }: { queries?: string[] },
) => {
  try {
    return await databases.listDocuments<UserAWModel>(
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

export const getUserByEmail = async (
  databases: Databases,
  { email }: { email: string },
) => {
  try {
    const result = await databases.listDocuments<UserAWModel>(
      DATABASE_ID,
      APPWRITE_USERS_ID,
      [Query.equal("email", email)],
    )

    return result.documents[0] ?? null
  } catch {
    return null
  }
}

export const updateLastSeenByUserId = async (
  databases: Databases,
  { id }: { id: string },
) => {
  const updatedProfile = await databases.updateDocument<UserAWModel>(
    DATABASE_ID,
    APPWRITE_USERS_ID,
    id,
    { lastSeenAt: new Date() },
  )

  return updatedProfile.lastSeenAt!
}
