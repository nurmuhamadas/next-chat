import { StatusCode } from "hono/utils/http-status"
import { Databases, ID, Query } from "node-appwrite"
import { z } from "zod"

import { ERROR } from "@/constants/error"
import { getChannelById } from "@/features/channel/lib/channel-queries"
import { getSubsHistory } from "@/features/channel/lib/channel-subscribers-queries"
import {
  getConversationById,
  getConversationOptHistory,
} from "@/features/chat/lib/queries"
import { getMemberHistory } from "@/features/group/lib/group-member-queries"
import { getGroupById } from "@/features/group/lib/group-queries"
import {
  APPWRITE_ATTACHMENTS_ID,
  APPWRITE_MESSAGES_ID,
  DATABASE_ID,
} from "@/lib/appwrite/config"

import { MESSAGE_STATUS } from "../constants"
import { createMessageSchema } from "../schema"

export const validateMessage = async (
  databases: Databases,
  form: z.infer<typeof createMessageSchema>,
): Promise<
  | undefined
  | {
      error: string
      path?: (string | number)[]
      code: StatusCode
    }
> => {
  if (form.conversationId) {
    const conversation = await getConversationById(databases, {
      conversationId: form.conversationId,
    })
    if (!conversation) {
      return {
        error: ERROR.CONVERSATION_NOT_FOUND,
        code: 404,
        path: ["conversationId"],
      }
    }
  }
  if (form.groupId) {
    const group = await getGroupById(databases, { id: form.groupId })
    if (!group) {
      return { error: ERROR.GROUP_NOT_FOUND, code: 404, path: ["groupId"] }
    }
  }
  if (form.channelId) {
    const channel = await getChannelById(databases, { id: form.channelId })
    if (!channel) {
      return { error: ERROR.CHANNEL_NOT_FOUND, code: 404, path: ["channelId"] }
    }
  }
  if (form.originalMessageId) {
    const originMessage = await getMessageById(databases, {
      id: form.originalMessageId,
    })
    if (!originMessage) {
      return {
        error: ERROR.MESSAGE_NOT_FOUND,
        code: 404,
        path: ["originalMessageId"],
      }
    }
  }
  if (form.parentMessageId) {
    const originMessage = await getMessageById(databases, {
      id: form.parentMessageId,
    })
    if (!originMessage) {
      return {
        error: ERROR.MESSAGE_NOT_FOUND,
        code: 404,
        path: ["parentMessageId"],
      }
    }
  }

  return undefined
}

export const getMessageById = async (
  databases: Databases,
  { id }: { id: string },
) => {
  try {
    return await databases.getDocument<MessageAWModel>(
      DATABASE_ID,
      APPWRITE_MESSAGES_ID,
      id,
    )
  } catch {
    return null
  }
}

export const createMessage = async (
  databases: Databases,
  form: MessageModel,
) => {
  return await databases.createDocument<MessageAWModel>(
    DATABASE_ID,
    APPWRITE_MESSAGES_ID,
    ID.unique(),
    form,
  )
}

export const getMessageByConversationId = async (
  databases: Databases,
  { conversationId, userId }: { conversationId: string; userId: string },
) => {
  try {
    const { data: conversationHistory } = await getConversationOptHistory(
      databases,
      {
        conversationId,
        userId,
      },
    )
    const dateRange = conversationHistory.map((opt) => [
      opt.$createdAt,
      opt.deletedAt ?? new Date().toISOString(),
    ])
    const dateQueries =
      dateRange.length > 1
        ? Query.or(
            dateRange.map(([start, end]) =>
              Query.between("$createdAt", start, end),
            ),
          )
        : Query.between("$createdAt", dateRange[0][0], dateRange[0][1])

    const result = await databases.listDocuments<MessageAWModel>(
      DATABASE_ID,
      APPWRITE_MESSAGES_ID,
      [
        Query.equal("conversationId", conversationId),
        Query.orderDesc("$createdAt"),
        dateQueries,
        Query.or([
          Query.notEqual("status", MESSAGE_STATUS.DELETED_FOR_ME),
          Query.and([
            Query.equal("status", MESSAGE_STATUS.DELETED_FOR_ME),
            Query.notEqual("userId", userId),
          ]),
        ]),
      ],
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

export const getMessageByGroupId = async (
  databases: Databases,
  { groupId, userId }: { groupId: string; userId: string },
) => {
  try {
    const { data: groupMembers } = await getMemberHistory(databases, {
      groupId,
      userId,
    })
    const dateRange = groupMembers.map((member) => [
      member.$createdAt,
      member.leftAt ?? new Date().toISOString(),
    ])
    const dateQueries =
      dateRange.length > 1
        ? Query.or(
            dateRange.map(([start, end]) =>
              Query.between("$createdAt", start, end),
            ),
          )
        : Query.between("$createdAt", dateRange[0][0], dateRange[0][1])

    const result = await databases.listDocuments<MessageAWModel>(
      DATABASE_ID,
      APPWRITE_MESSAGES_ID,
      [
        Query.equal("groupId", groupId),
        Query.orderDesc("$createdAt"),
        dateQueries,
        Query.or([
          Query.notEqual("status", MESSAGE_STATUS.DELETED_FOR_ME),
          Query.and([
            Query.equal("status", MESSAGE_STATUS.DELETED_FOR_ME),
            Query.notEqual("userId", userId),
          ]),
        ]),
      ],
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

export const getMessageByChannelId = async (
  databases: Databases,
  { channelId, userId }: { channelId: string; userId: string },
) => {
  try {
    const { data: subsHistory } = await getSubsHistory(databases, {
      channelId,
      userId,
    })
    const dateRange = subsHistory.map((sub) => [
      sub.$createdAt,
      sub.unsubscribedAt ?? new Date().toISOString(),
    ])
    const dateQueries =
      dateRange.length > 1
        ? Query.or(
            dateRange.map(([start, end]) =>
              Query.between("$createdAt", start, end),
            ),
          )
        : Query.between("$createdAt", dateRange[0][0], dateRange[0][1])

    const result = await databases.listDocuments<MessageAWModel>(
      DATABASE_ID,
      APPWRITE_MESSAGES_ID,
      [
        Query.equal("channelId", channelId),
        Query.orderDesc("$createdAt"),
        dateQueries,
        Query.or([
          Query.notEqual("status", MESSAGE_STATUS.DELETED_FOR_ME),
          Query.and([
            Query.equal("status", MESSAGE_STATUS.DELETED_FOR_ME),
            Query.notEqual("userId", userId),
          ]),
        ]),
      ],
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

// =============== ATTACHMENT ===============
export const createAttachment = async (
  databases: Databases,
  data: AttachmentModel,
) => {
  return await databases.createDocument<AttachmentAWModel>(
    DATABASE_ID,
    APPWRITE_ATTACHMENTS_ID,
    ID.unique(),
    data,
  )
}

export const getAttachmentsByMessageIds = async (
  databases: Databases,
  { messageIds }: { messageIds: string[] },
) => {
  try {
    const result = await databases.listDocuments<AttachmentAWModel>(
      DATABASE_ID,
      APPWRITE_ATTACHMENTS_ID,
      [Query.contains("messageId", messageIds)],
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
