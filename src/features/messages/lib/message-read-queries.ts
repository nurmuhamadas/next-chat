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

export const updateLastConvMessageRead = async (
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
    await updateLastConvMessageRead(databases, {
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
