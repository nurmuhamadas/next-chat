import "server-only"

import { Databases, ID } from "node-appwrite"

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
