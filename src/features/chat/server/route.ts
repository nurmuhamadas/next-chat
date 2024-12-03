import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { Query } from "node-appwrite"

import { ERROR } from "@/constants/error"
import { validateBlockedEach } from "@/features/blocked-users/lib/queries"
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

import { mapConvsModelToConversation } from "./utils"

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
      queries: [Query.contains("$id", userPairIds)],
    })

    // TODO: add conversation from groups and channels

    const conversationList: Conversation[] = result.data.map((conv) => {
      const user = users.find(
        (u) => u.$id === conv.userId1 || u.$id === conv.userId2,
      )
      // TODO: last message and unread message
      return mapConvsModelToConversation(conv, user!)
    })

    const response: GetConversationListResponse = successCollectionResponse(
      conversationList,
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
