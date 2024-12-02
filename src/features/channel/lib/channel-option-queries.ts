import { Databases, ID } from "node-appwrite"

import { APPWRITE_CHANNEL_OPTIONS_ID, DATABASE_ID } from "@/lib/appwrite/config"

export const createChannelOption = async (
  databases: Databases,
  formData: ChannelOptionModel,
) => {
  return await databases.createDocument<ChannelOptionAWModel>(
    DATABASE_ID,
    APPWRITE_CHANNEL_OPTIONS_ID,
    ID.unique(),
    formData,
  )
}
