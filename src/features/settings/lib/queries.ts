import { Databases, ID, Query } from "node-appwrite"

import { NOTIFICATION_OPT } from "@/features/user/constants"
import { APPWRITE_SETTINGS_ID, DATABASE_ID } from "@/lib/appwrite/config"

export const createUserSetting = async (
  databases: Databases,
  { userId }: { userId: string },
) => {
  return await databases.createDocument<SettingAWModel>(
    DATABASE_ID,
    APPWRITE_SETTINGS_ID,
    ID.unique(),
    {
      userId,
      notifications: NOTIFICATION_OPT.map((v) => v.value),
    },
  )
}

export const getSettings = async (
  databases: Databases,
  { userId }: { userId: string },
) => {
  try {
    const result = await databases.listDocuments<SettingAWModel>(
      DATABASE_ID,
      APPWRITE_SETTINGS_ID,
      [Query.equal("userId", userId)],
    )

    if (result.total === 0) return null

    return result.documents[0]
  } catch {
    return null
  }
}
