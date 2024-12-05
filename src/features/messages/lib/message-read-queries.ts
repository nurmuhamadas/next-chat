import { Databases, ID, Query } from "node-appwrite"

import { APPWRITE_MESSAGE_READS_ID, DATABASE_ID } from "@/lib/appwrite/config"

export const getLastConvMessageRead = async (
  databases: Databases,
  { conversationId, userId }: { conversationId: string; userId: string },
) => {
  try {
    const result = await databases.listDocuments<MessageReadAWModel>(
      DATABASE_ID,
      APPWRITE_MESSAGE_READS_ID,
      [
        Query.equal("conversationId", conversationId),
        Query.equal("userId", userId),
        Query.limit(1),
      ],
    )

    if (result.total === 0) return null

    return result.documents[0]
  } catch {
    return null
  }
}

export const createLastConvMessageRead = async (
  databases: Databases,
  {
    userId,
    conversationId,
    lastMessageReadId,
  }: { userId: string; conversationId: string; lastMessageReadId: string },
) => {
  return await databases.createDocument<MessageReadAWModel>(
    DATABASE_ID,
    APPWRITE_MESSAGE_READS_ID,
    ID.unique(),
    { lastMessageReadId, userId, conversationId },
  )
}

export const updateLastMessageRead = async (
  databases: Databases,
  { id, lastMessageReadId }: { id: string; lastMessageReadId: string },
) => {
  return await databases.updateDocument<MessageReadAWModel>(
    DATABASE_ID,
    APPWRITE_MESSAGE_READS_ID,
    id,
    { lastMessageReadId },
  )
}

export const createOrUpdateLastConvMessageRead = async (
  databases: Databases,
  {
    userId,
    conversationId,
    lastMessageReadId,
  }: { userId: string; conversationId: string; lastMessageReadId: string },
) => {
  const lastMessageRead = await getLastConvMessageRead(databases, {
    conversationId,
    userId,
  })
  if (lastMessageRead) {
    await updateLastMessageRead(databases, {
      id: lastMessageRead?.$id,
      lastMessageReadId,
    })
  } else {
    await createLastConvMessageRead(databases, {
      userId,
      conversationId,
      lastMessageReadId,
    })
  }
}

export const getLastGroupMessageRead = async (
  databases: Databases,
  { groupId, userId }: { groupId: string; userId: string },
) => {
  try {
    const result = await databases.listDocuments<MessageReadAWModel>(
      DATABASE_ID,
      APPWRITE_MESSAGE_READS_ID,
      [
        Query.equal("groupId", groupId),
        Query.equal("userId", userId),
        Query.limit(1),
      ],
    )

    if (result.total === 0) return null

    return result.documents[0]
  } catch {
    return null
  }
}

export const createLastGroupMessageRead = async (
  databases: Databases,
  {
    userId,
    groupId,
    lastMessageReadId,
  }: { userId: string; groupId: string; lastMessageReadId: string },
) => {
  return await databases.createDocument<MessageReadAWModel>(
    DATABASE_ID,
    APPWRITE_MESSAGE_READS_ID,
    ID.unique(),
    { lastMessageReadId, userId, groupId },
  )
}

export const createOrUpdateLastGroupMessageRead = async (
  databases: Databases,
  {
    userId,
    groupId,
    lastMessageReadId,
  }: { userId: string; groupId: string; lastMessageReadId: string },
) => {
  const lastMessageRead = await getLastGroupMessageRead(databases, {
    groupId,
    userId,
  })
  if (lastMessageRead) {
    await updateLastMessageRead(databases, {
      id: lastMessageRead?.$id,
      lastMessageReadId,
    })
  } else {
    await createLastGroupMessageRead(databases, {
      userId,
      groupId,
      lastMessageReadId,
    })
  }
}

export const getLastChannelMessageRead = async (
  databases: Databases,
  { channelId, userId }: { channelId: string; userId: string },
) => {
  try {
    const result = await databases.listDocuments<MessageReadAWModel>(
      DATABASE_ID,
      APPWRITE_MESSAGE_READS_ID,
      [
        Query.equal("channelId", channelId),
        Query.equal("userId", userId),
        Query.limit(1),
      ],
    )

    if (result.total === 0) return null

    return result.documents[0]
  } catch {
    return null
  }
}

export const createLastChannelMessageRead = async (
  databases: Databases,
  {
    userId,
    channelId,
    lastMessageReadId,
  }: { userId: string; channelId: string; lastMessageReadId: string },
) => {
  return await databases.createDocument<MessageReadAWModel>(
    DATABASE_ID,
    APPWRITE_MESSAGE_READS_ID,
    ID.unique(),
    { lastMessageReadId, userId, channelId },
  )
}

export const createOrUpdateLastChannelMessageRead = async (
  databases: Databases,
  {
    userId,
    channelId,
    lastMessageReadId,
  }: { userId: string; channelId: string; lastMessageReadId: string },
) => {
  const lastMessageRead = await getLastChannelMessageRead(databases, {
    channelId,
    userId,
  })
  if (lastMessageRead) {
    await updateLastMessageRead(databases, {
      id: lastMessageRead?.$id,
      lastMessageReadId,
    })
  } else {
    await createLastChannelMessageRead(databases, {
      userId,
      channelId,
      lastMessageReadId,
    })
  }
}
