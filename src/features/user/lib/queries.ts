import { Databases, Query } from "node-appwrite"

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
