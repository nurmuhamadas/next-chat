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

export const getChannelOption = async (
  databases: Databases,
  { userId, channelId }: { userId: string; channelId: string },
) => {
  try {
    const result = await databases.listDocuments<ChannelOptionAWModel>(
      DATABASE_ID,
      APPWRITE_CHANNEL_OPTIONS_ID,
      [Query.equal("channelId", channelId), Query.equal("userId", userId)],
    )

    if (result.total === 0) return null

    return result.documents[0]
  } catch {
    return null
  }
}

export const updateChannelOption = async (
  databases: Databases,
  id: string,
  formData: Partial<ChannelOptionModel>,
) => {
  return await databases.updateDocument<ChannelOptionAWModel>(
    DATABASE_ID,
    APPWRITE_CHANNEL_OPTIONS_ID,
    id,
    formData,
  )
}
