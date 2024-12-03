import { Databases, ID, Query } from "node-appwrite"

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

export const deleteChannelOption = async (
  databases: Databases,
  { userId, channelId }: { userId: string; channelId: string },
) => {
  const result = await databases.listDocuments<ChannelOptionAWModel>(
    DATABASE_ID,
    APPWRITE_CHANNEL_OPTIONS_ID,
    [Query.equal("userId", userId), Query.equal("channelId", channelId)],
  )

  if (result.total === 0) return null

  return await databases.deleteDocument(
    DATABASE_ID,
    APPWRITE_CHANNEL_OPTIONS_ID,
    result.documents[0].$id,
  )
}
