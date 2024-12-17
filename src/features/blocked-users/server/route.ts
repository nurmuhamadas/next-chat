import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { collectionSchema } from "@/constants"
import { ERROR } from "@/constants/error"
import { prisma } from "@/lib/prisma"
import { sessionMiddleware } from "@/lib/session-middleware"
import {
  createError,
  successCollectionResponse,
  successResponse,
} from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"

import { blockUser, getBlockedUsers, unblockUser } from "../lib/queries"
import { mapBlockedUserModelToBlockedUser } from "../lib/utils"

const blockedUserApp = new Hono()
  .get(
    "/",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("query", collectionSchema),
    async (c) => {
      try {
        const { limit, cursor } = c.req.valid("query")
        const { userId } = c.get("userProfile")

        const blockedUsers = await getBlockedUsers({ userId, limit, cursor })

        const total = blockedUsers.length
        const nextCursor =
          blockedUsers.length > 0 ? blockedUsers[total - 1].id : undefined
        const response: GetBlockedUsersResponse = successCollectionResponse(
          blockedUsers.map(mapBlockedUserModelToBlockedUser),
          total,
          nextCursor,
        )

        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post(
    "/:blockedUserId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { blockedUserId } = c.req.param()
        const { userId } = c.get("userProfile")

        const blockedProfile = await prisma.profile.findUnique({
          where: { userId: blockedUserId },
        })
        if (!blockedProfile) {
          return c.json(createError(ERROR.USER_NOT_FOUND), 404)
        }

        const blockedUsers = await prisma.blockedUser.findMany({
          select: { id: true },
          where: { blockedUserId, userId, unblockedAt: { equals: null } },
          take: 1,
        })
        if (blockedUsers.length > 0) {
          return c.json(createError(ERROR.USER_ALREADY_BLOCKED), 400)
        }

        const result = await blockUser({ userId, blockedUserId })

        const response: BlockUserResponse = successResponse({ id: result.id })
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .delete(
    "/:blockedUserId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { blockedUserId } = c.req.param()
        const { userId } = c.get("userProfile")

        const blockedUsers = await prisma.blockedUser.findMany({
          where: { userId, blockedUserId },
        })
        if (blockedUsers.length === 0) {
          return c.json(createError(ERROR.BLOCKED_USER_NOT_FOUND))
        }

        await unblockUser({ blockedUserId, userId })

        const response: UnblockUserResponse = successResponse({
          id: blockedUserId,
        })
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )

export default blockedUserApp
