import { StatusCode } from "hono/utils/http-status"
import { Databases, ID } from "node-appwrite"
import { z } from "zod"

import { ERROR } from "@/constants/error"
import { getChannelById } from "@/features/channel/lib/channel-queries"
import { getConversationById } from "@/features/chat/lib/queries"
import { getGroupById } from "@/features/group/lib/group-queries"
import {
  APPWRITE_ATTACHMENTS_ID,
  APPWRITE_MESSAGES_ID,
  DATABASE_ID,
} from "@/lib/appwrite/config"

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
