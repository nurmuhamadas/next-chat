import { Databases, ID, Query } from "node-appwrite"

import {
  APPWRITE_CHANNEL_SUBSCRIBERS_ID,
  DATABASE_ID,
} from "@/lib/appwrite/config"

export const createChannelSubscriber = async (
  databases: Databases,
  formData: Omit<ChannelSubscriberModel, "subscribedAt" | "unsubscribedAt">,
) => {
  return await databases.createDocument<ChannelSubscriberAWModel>(
    DATABASE_ID,
    APPWRITE_CHANNEL_SUBSCRIBERS_ID,
    ID.unique(),
    { ...formData, subscribedAt: new Date() },
  )
}

export const getChannelSubsByUserId = async (
  databases: Databases,
  { userId }: { userId: string },
): Promise<QueryResults<ChannelSubscriberAWModel>> => {
  try {
    const result = await databases.listDocuments<ChannelSubscriberAWModel>(
      DATABASE_ID,
      APPWRITE_CHANNEL_SUBSCRIBERS_ID,
      [Query.equal("userId", userId), Query.isNull("unsubscribedAt")],
    )

    return {
      total: result.total,
      data: result.documents,
    }
  } catch {
    return {
      total: 0,
      data: [],
    }
  }
}

export const validateChannelSubs = async (
  databases: Databases,
  { userId, channelId }: { userId: string; channelId: string },
) => {
  const result = await databases.listDocuments<ChannelSubscriberAWModel>(
    DATABASE_ID,
    APPWRITE_CHANNEL_SUBSCRIBERS_ID,
    [
      Query.equal("userId", userId),
      Query.equal("channelId", channelId),
      Query.isNull("unsubscribedAt"),
    ],
  )

  return result.total > 0
}
