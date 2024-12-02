import { Databases, ID, Query } from "node-appwrite"

import { getUsers } from "@/features/user/lib/queries"
import {
  APPWRITE_CHANNEL_SUBSCRIBERS_ID,
  APPWRITE_CHANNELS_ID,
  DATABASE_ID,
} from "@/lib/appwrite/config"
import { generateInviteCode } from "@/lib/utils"

import { getChannelSubsByUserId } from "./channel-subscribers-queries"
import { mapUserModelToChannelOwner } from "./utils"

export const checkChannelNameAvailablity = async (
  databases: Databases,
  { name }: { name: string },
) => {
  const result = await databases.listDocuments(
    DATABASE_ID,
    APPWRITE_CHANNELS_ID,
    [Query.equal("name", name)],
  )

  return result.total === 0
}

export const createChannelInviteCode = async (databases: Databases) => {
  let isExist = true
  let inviteCode = generateInviteCode(10)
  while (isExist) {
    const result = await databases.listDocuments(
      DATABASE_ID,
      APPWRITE_CHANNELS_ID,
      [Query.equal("inviteCode", inviteCode)],
    )
    isExist = result.total > 0
    if (isExist) {
      inviteCode = generateInviteCode(10)
    }
  }

  return inviteCode
}

export const createChannel = async (
  databases: Databases,
  formData: ChannelModel,
) => {
  return await databases.createDocument<ChannelAWModel>(
    DATABASE_ID,
    APPWRITE_CHANNELS_ID,
    ID.unique(),
    formData,
  )
}

export const getChannelsByUserId = async (
  databases: Databases,
  { userId }: { userId: string },
) => {
  try {
    const members = await getChannelSubsByUserId(databases, { userId })
    const channelIds = members.data.map((v) => v.channelId)

    const channels = await databases.listDocuments<ChannelAWModel>(
      DATABASE_ID,
      APPWRITE_CHANNELS_ID,
      [Query.contains("$id", channelIds)],
    )

    return channels
  } catch {
    return {
      total: 0,
      documents: [],
    }
  }
}

export const getChannelOwnersByUserIds = async (
  databases: Databases,
  { userIds }: { userIds: string[] },
): Promise<QueryResults<ChannelOwner>> => {
  const result = await getUsers(databases, {
    queries: [
      Query.contains("$id", userIds),
      Query.select(["$id", "firstName", "lastName", "imageUrl"]),
    ],
  })

  return {
    total: result.total,
    data: result.documents.map(mapUserModelToChannelOwner),
  }
}

export const searchChannels = async (
  databases: Databases,
  {
    query,
    limit,
    offset,
  }: { query?: string; limit: number; offset: number } = {
    limit: 20,
    offset: 0,
  },
): Promise<QueryResults<ChannelSearch>> => {
  const queries = [
    Query.limit(limit),
    Query.offset(offset),
    Query.select(["$id", "name", "imageUrl"]),
  ]

  if (query) {
    queries.push(Query.search("name", query))
  }

  try {
    const result = await databases.listDocuments<ChannelAWModel>(
      DATABASE_ID,
      APPWRITE_CHANNELS_ID,
      queries,
    )
    const channelIds = result.documents.map((v) => v.$id)

    const subsResult = await databases.listDocuments<ChannelSubscriberAWModel>(
      DATABASE_ID,
      APPWRITE_CHANNEL_SUBSCRIBERS_ID,
      [
        Query.contains("channelId", channelIds),
        Query.isNull("unsubscribedAt"),
        Query.select(["channelId"]),
      ],
    )

    const searchResult: ChannelSearch[] = result.documents.map((channel) => ({
      id: channel.$id,
      name: channel.name,
      imageUrl: channel.imageUrl,
      totalSubscribers:
        subsResult.documents.filter(
          (member) => member.channelId === channel.$id,
        ).length ?? 0,
    }))

    return {
      total: result.total,
      data: searchResult,
    }
  } catch {
    return {
      total: 0,
      data: [],
    }
  }
}

export const getChannelById = async (
  databases: Databases,
  { id }: { id: string },
) => {
  try {
    return await databases.getDocument<ChannelAWModel>(
      DATABASE_ID,
      APPWRITE_CHANNELS_ID,
      id,
    )
  } catch {
    return null
  }
}

export const validateJoinCode = async (
  databases: Databases,
  { channelId, code }: { channelId: string; code: string },
) => {
  const result = await databases.getDocument<ChannelAWModel>(
    DATABASE_ID,
    APPWRITE_CHANNELS_ID,
    channelId,
    [Query.select(["inviteCode"])],
  )

  return result.inviteCode === code
}
