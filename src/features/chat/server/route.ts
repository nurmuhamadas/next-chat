import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { Query } from "node-appwrite"

import { ERROR } from "@/constants/error"
import { validateBlockedEach } from "@/features/blocked-users/lib/queries"
import { getChannelsByUserId } from "@/features/channel/lib/channel-queries"
import { getGroupsByUserId } from "@/features/group/lib/group-queries"
import {
  getTotalUnreadChannelMessage,
  getTotalUnreadConvMessage,
  getTotalUnreadGroupMessage,
} from "@/features/messages/lib/message-read-queries"
import {
  getLastMessageByChannelIds,
  getLastMessageByConversationIds,
  getLastMessageByGroupIds,
} from "@/features/messages/lib/queries"
import { getUserProfileById, getUsers } from "@/features/user/lib/queries"
import { sessionMiddleware } from "@/lib/session-middleware"
import {
  createError,
  successCollectionResponse,
  successResponse,
} from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"
import { zodErrorHandler } from "@/lib/zod-error-handler"

import {
  createConversation,
  createConversationOption,
  deleteConversationOptById,
  getConversationById,
  getConversationByUserIds,
  getConversations,
  getLastConversationOpt,
} from "../lib/queries"
import { conversationSchema } from "../schema"

import {
  mapChannelModelToConversation,
  mapConvsModelToConversation,
  mapGroupModelToConversation,
} from "./utils"

const conversationApp = new Hono()
  .get("/", sessionMiddleware, validateProfileMiddleware, async (c) => {
    const databases = c.get("databases")
    const currentProfile = c.get("userProfile")

    const result = await getConversations(databases, {
      userId: currentProfile.$id,
    })
    const userPairIds = result.data.map((conv) =>
      conv.userId1 === currentProfile.$id ? conv.userId2 : conv.userId1,
    )
    const { documents: users } = await getUsers(databases, {
      queries: [Query.equal("$id", userPairIds)],
    })

    const { documents: groups } = await getGroupsByUserId(databases, {
      userId: currentProfile.$id,
    })
    const groupIds = groups.map((v) => v.$id)
    const unreadGroupMessages = await getTotalUnreadGroupMessage(databases, {
      userId: currentProfile.$id,
      groupIds,
    })
    const lastGroupMessages = await getLastMessageByGroupIds(databases, {
      groupIds,
    })
    const groupList: Conversation[] = groups.map((group) => {
      const totalUnread = unreadGroupMessages[group.$id]
      const lastMessage = lastGroupMessages[group.$id]
      return mapGroupModelToConversation(group, lastMessage, totalUnread)
    })

    const { documents: channels } = await getChannelsByUserId(databases, {
      userId: currentProfile.$id,
    })
    const channelIds = channels.map((v) => v.$id)
    const unreadChannelMessages = await getTotalUnreadChannelMessage(
      databases,
      {
        userId: currentProfile.$id,
        channelIds,
      },
    )
    const lastChannelMessages = await getLastMessageByChannelIds(databases, {
      channelIds,
    })
    const channelList: Conversation[] = channels.map((channel) => {
      const totalUnread = unreadChannelMessages[channel.$id]
      const lastMessage = lastChannelMessages[channel.$id]
      return mapChannelModelToConversation(channel, lastMessage, totalUnread)
    })

    const conversationIds = result.data.map((v) => v.$id)
    const unreadConvMessages = await getTotalUnreadConvMessage(databases, {
      userId: currentProfile.$id,
      conversationIds,
    })
    const lastMessages = await getLastMessageByConversationIds(databases, {
      conversationIds,
    })
    const conversationList: Conversation[] = result.data.map((conv) => {
      const user = users.find(
        (u) => u.$id === conv.userId1 || u.$id === conv.userId2,
      )
      const totalUnread = unreadConvMessages[conv.$id]
      const lastMessage = lastMessages[conv.$id]
      return mapConvsModelToConversation(conv, user!, lastMessage, totalUnread)
    })

    const finalList = [...groupList, ...conversationList, ...channelList].sort(
      (a, b) => {
        if (!a.lastMessage && !b.lastMessage) return 0
        if (!a.lastMessage) return 1
        if (!b.lastMessage) return -1

        return b.lastMessage.id.localeCompare(a.lastMessage.id)
      },
    )

    const response: GetConversationListResponse = successCollectionResponse(
      finalList,
      result.total,
    )
    return c.json(response)
  })
  .post(
    "/",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("json", conversationSchema, zodErrorHandler),
    async (c) => {
      const { userId } = c.req.valid("json")

      const databases = c.get("databases")
      const currentProfile = c.get("userProfile")

      const user = await getUserProfileById(databases, { userId })
      if (!user) {
        return c.json(createError(ERROR.USER_NOT_FOUND), 404)
      }

      const isBlockOrBlocked = await validateBlockedEach(databases, {
        userId1: currentProfile.$id,
        userId2: userId,
      })
      if (isBlockOrBlocked) {
        return c.json(
          createError(
            ERROR.CANNOT_CREATE_CONVERSATION_WITH_BLOCK_OR_BLOCKED_USER,
          ),
          403,
        )
      }

      const currConversation = await getConversationByUserIds(databases, {
        userId1: currentProfile.$id,
        userId2: userId,
      })
      if (currConversation) {
        const lastConversationOpt = await getLastConversationOpt(databases, {
          userId: currentProfile.$id,
          conversationId: currConversation.$id,
        })
        if (lastConversationOpt && !lastConversationOpt.deletedAt) {
          return c.json(createError(ERROR.CONVERSATION_ALREADY_EXIST), 400)
        }

        await createConversationOption(databases, {
          conversationId: currConversation.$id,
          userId: currentProfile.$id,
          notification: lastConversationOpt?.notification ?? true,
        })

        const response: CreateConversationResponse = successResponse(
          mapConvsModelToConversation(currConversation, user),
        )
        return c.json(response)
      }

      const result = await createConversation(databases, {
        userId1: currentProfile.$id,
        userId2: userId,
      })

      await createConversationOption(databases, {
        conversationId: result.$id,
        userId: currentProfile.$id,
        notification: true,
      })
      await createConversationOption(databases, {
        conversationId: result.$id,
        userId,
        notification: true,
      })

      const conversation = mapConvsModelToConversation(result, user)

      const response: CreateConversationResponse = successResponse(conversation)
      return c.json(response)
    },
  )
  .delete(
    "/:conversationId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const { conversationId } = c.req.param()

      const databases = c.get("databases")
      const currentProfile = c.get("userProfile")

      const conversation = await getConversationById(databases, {
        conversationId,
      })
      if (!conversation) {
        return c.json(createError(ERROR.CONVERSATION_NOT_FOUND), 404)
      }

      const lastConversationOpt = await getLastConversationOpt(databases, {
        conversationId,
        userId: currentProfile.$id,
      })
      if (!lastConversationOpt || !!lastConversationOpt.deletedAt) {
        return c.json(createError(ERROR.CONVERSATION_ALREADY_DELETED), 400)
      }

      await deleteConversationOptById(databases, {
        conversationOptId: lastConversationOpt.$id,
      })

      const response: DeleteConversationResponse = successResponse({
        id: conversationId,
      })
      return c.json(response)
    },
  )

export default conversationApp
