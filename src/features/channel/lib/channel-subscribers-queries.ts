import { Databases, ID, Query } from "node-appwrite"

import { getUsers } from "@/features/user/lib/queries"
import {
  APPWRITE_CHANNEL_SUBSCRIBERS_ID,
  DATABASE_ID,
} from "@/lib/appwrite/config"

import { mapChannelSubModelToChannelSub } from "./utils"

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

export const getChannelSubs = async (
  databases: Databases,
  { channelId }: { channelId: string },
): Promise<QueryResults<ChannelSubscriber>> => {
  try {
    const result = await databases.listDocuments<ChannelSubscriberAWModel>(
      DATABASE_ID,
      APPWRITE_CHANNEL_SUBSCRIBERS_ID,
      [Query.equal("channelId", channelId), Query.isNull("unsubscribedAt")],
    )
    const memberIds = result.documents.map((v) => v.userId)

    const memberProfiles = await getUsers(databases, {
      queries: [
        Query.contains("$id", memberIds),
        Query.select([
          "$id",
          "firstName",
          "lastName",
          "imageUrl",
          "lastSeenAt",
        ]),
      ],
    })
    const memberProfileIds = memberProfiles.documents.map((v) => v.$id)

    const members = result.documents
      .filter((member) => memberProfileIds.includes(member.userId))
      .map((member) => {
        const profile = memberProfiles.documents.find(
          (v) => v.$id === member.userId,
        )
        return mapChannelSubModelToChannelSub(member, profile!)
      })

    return {
      total: members.length,
      data: members,
    }
  } catch {
    return {
      total: 0,
      data: [],
    }
  }
}

export const validateChannelAdmin = async (
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

  return result.documents[0]?.isAdmin ?? false
}

export const setUserAsAdmin = async (
  databases: Databases,
  { userId, channelId }: { userId: string; channelId: string },
) => {
  const result = await databases.listDocuments<ChannelSubscriberAWModel>(
    DATABASE_ID,
    APPWRITE_CHANNEL_SUBSCRIBERS_ID,
    [
      Query.equal("userId", userId),
      Query.equal("channelId", channelId),
      Query.isNull("leftAt"),
    ],
  )

  if (result.total === 0) throw Error()

  return await databases.updateDocument<ChannelSubscriberAWModel>(
    DATABASE_ID,
    APPWRITE_CHANNEL_SUBSCRIBERS_ID,
    result.documents[0]?.$id,
    { isAdmin: true },
  )
}

export const unsetUserAdmin = async (
  databases: Databases,
  { userId, channelId }: { userId: string; channelId: string },
) => {
  const result = await databases.listDocuments<ChannelSubscriberAWModel>(
    DATABASE_ID,
    APPWRITE_CHANNEL_SUBSCRIBERS_ID,
    [
      Query.equal("userId", userId),
      Query.equal("channelId", channelId),
      Query.isNull("leftAt"),
    ],
  )

  if (result.total === 0) throw Error()

  return await databases.updateDocument<ChannelSubscriberAWModel>(
    DATABASE_ID,
    APPWRITE_CHANNEL_SUBSCRIBERS_ID,
    result.documents[0]?.$id,
    { isAdmin: false },
  )
}
