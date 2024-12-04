import { Databases, ID, Query } from "node-appwrite"

import {
  APPWRITE_CONVERSATION_OPTIONS_ID,
  APPWRITE_CONVERSATIONS_ID,
  DATABASE_ID,
} from "@/lib/appwrite/config"

export const getConversationByUserIds = async (
  databases: Databases,
  { userId1, userId2 }: { userId1: string; userId2: string },
) => {
  const result = await databases.listDocuments<ConversationAWModel>(
    DATABASE_ID,
    APPWRITE_CONVERSATIONS_ID,
    [
      Query.or([
        Query.and([
          Query.equal("userId1", userId1),
          Query.equal("userId2", userId2),
        ]),
        Query.and([
          Query.equal("userId1", userId2),
          Query.equal("userId2", userId1),
        ]),
      ]),
    ],
  )

  if (result.total === 0) return null

  return result.documents[0]
}

export const createConversation = async (
  databases: Databases,
  data: ConversationModel,
) => {
  return await databases.createDocument<ConversationAWModel>(
    DATABASE_ID,
    APPWRITE_CONVERSATIONS_ID,
    ID.unique(),
    {
      ...data,
    },
  )
}

export const getConversationById = async (
  databases: Databases,
  { conversationId }: { conversationId: string },
) => {
  try {
    return await databases.getDocument<ConversationAWModel>(
      DATABASE_ID,
      APPWRITE_CONVERSATIONS_ID,
      conversationId,
    )
  } catch {
    return null
  }
}

export const getConversations = async (
  databases: Databases,
  { userId }: { userId: string },
) => {
  try {
    const result = await databases.listDocuments<ConversationAWModel>(
      DATABASE_ID,
      APPWRITE_CONVERSATIONS_ID,
      [
        Query.or([
          Query.equal("userId1", userId),
          Query.equal("userId2", userId),
        ]),
      ],
    )

    if (result.total === 0) {
      return {
        total: 0,
        data: [],
      }
    }

    const conversationIds = result.documents.map((v) => v.$id)

    const conversationOpt =
      await databases.listDocuments<ConversationOptionAWModel>(
        DATABASE_ID,
        APPWRITE_CONVERSATION_OPTIONS_ID,
        [
          Query.equal("userId", userId),
          Query.contains("conversationId", conversationIds),
          Query.isNull("deletedAt"),
        ],
      )
    const activeConversationIds = conversationOpt.documents.map(
      (v) => v.conversationId,
    )

    const activeConversations = result.documents.filter((c) =>
      activeConversationIds.includes(c.$id),
    )

    return {
      total: activeConversations.length,
      data: activeConversations,
    }
  } catch {
    return {
      total: 0,
      data: [],
    }
  }
}

// ================ CONVERSATION OPTION ================
export const createConversationOption = async (
  databases: Databases,
  data: Omit<ConversationOptionModel, "deletedAt">,
) => {
  return await databases.createDocument<ConversationAWModel>(
    DATABASE_ID,
    APPWRITE_CONVERSATION_OPTIONS_ID,
    ID.unique(),
    {
      ...data,
    },
  )
}

export const getConversationOpt = async (
  databases: Databases,
  { userId, conversationId }: { userId: string; conversationId: string },
) => {
  try {
    const result = await databases.listDocuments<ConversationOptionAWModel>(
      DATABASE_ID,
      APPWRITE_CONVERSATION_OPTIONS_ID,
      [
        Query.equal("userId", userId),
        Query.equal("conversationId", conversationId),
        Query.isNull("deletedAt"),
      ],
    )

    if (result.total === 0) return null

    return result.documents[0]
  } catch {
    return null
  }
}

export const getConversationOptHistory = async (
  databases: Databases,
  { userId, conversationId }: { userId: string; conversationId: string },
) => {
  try {
    const result = await databases.listDocuments<ConversationOptionAWModel>(
      DATABASE_ID,
      APPWRITE_CONVERSATION_OPTIONS_ID,
      [
        Query.equal("userId", userId),
        Query.equal("conversationId", conversationId),
      ],
    )

    return {
      data: result.documents,
      total: result.total,
    }
  } catch {
    return {
      data: [],
      total: 0,
    }
  }
}

export const getLastConversationOpt = async (
  databases: Databases,
  { userId, conversationId }: { userId: string; conversationId: string },
) => {
  try {
    const result = await databases.listDocuments<ConversationOptionAWModel>(
      DATABASE_ID,
      APPWRITE_CONVERSATION_OPTIONS_ID,
      [
        Query.equal("userId", userId),
        Query.equal("conversationId", conversationId),
        Query.orderDesc("$id"),
      ],
    )

    if (result.total === 0) return null

    return result.documents[0]
  } catch {
    return null
  }
}

export const deleteConversationOptById = async (
  databases: Databases,
  { conversationOptId }: { conversationOptId: string },
) => {
  return await databases.updateDocument<ConversationOptionAWModel>(
    DATABASE_ID,
    APPWRITE_CONVERSATION_OPTIONS_ID,
    conversationOptId,
    {
      deletedAt: new Date(),
    },
  )
}
