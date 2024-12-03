import "server-only"

import { Databases, ID, Query } from "node-appwrite"

import { APPWRITE_GROUP_OPTIONS_ID, DATABASE_ID } from "@/lib/appwrite/config"

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

export const deleteGroupOption = async (
  databases: Databases,
  { userId, groupId }: { userId: string; groupId: string },
) => {
  const result = await databases.listDocuments<GroupOptionAWModel>(
    DATABASE_ID,
    APPWRITE_GROUP_OPTIONS_ID,
    [Query.equal("groupId", groupId), Query.equal("userId", userId)],
  )

  if (result.total === 0) throw Error()

  return await databases.deleteDocument(
    DATABASE_ID,
    APPWRITE_GROUP_OPTIONS_ID,
    result.documents[0].$id,
  )
}

export const getGroupOption = async (
  databases: Databases,
  { userId, groupId }: { userId: string; groupId: string },
) => {
  try {
    const result = await databases.listDocuments<GroupOptionAWModel>(
      DATABASE_ID,
      APPWRITE_GROUP_OPTIONS_ID,
      [Query.equal("groupId", groupId), Query.equal("userId", userId)],
    )

    if (result.total === 0) return null

    return result.documents[0]
  } catch {
    return null
  }
}

export const updateGroupOption = async (
  databases: Databases,
  id: string,
  formData: Partial<GroupOptionModel>,
) => {
  return await databases.updateDocument<GroupOptionAWModel>(
    DATABASE_ID,
    APPWRITE_GROUP_OPTIONS_ID,
    id,
    formData,
  )
}
