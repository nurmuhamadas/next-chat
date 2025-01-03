import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { collectionSchema } from "@/constants"
import { ERROR } from "@/constants/error"
import AuthorizationError from "@/lib/exceptions/authorization-error"
import InvariantError from "@/lib/exceptions/invariant-error"
import NotFoundError from "@/lib/exceptions/not-found-error"
import { prisma } from "@/lib/prisma"
import { sessionMiddleware } from "@/lib/session-middleware"
import { successCollectionResponse, successResponse } from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"

import { blockUser, unblockUser } from "../lib/queries"
import { mapBlockedUserModelToBlockedUser } from "../lib/utils"

const blockedUserApp = new Hono()
  .get(
    "/",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("query", collectionSchema),
    async (c) => {
      const { limit, cursor } = c.req.valid("query")
      const { userId } = c.get("userProfile")

      const blockedUsers = await prisma.blockedUser.findMany({
        where: { userId, unblockedAt: null },
        select: {
          id: true,
          blockedUser: {
            select: {
              id: true,
              profile: { select: { name: true, imageUrl: true } },
            },
          },
        },
        take: limit,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : undefined,
      })

      const total = blockedUsers.length
      const nextCursor =
        total > 0 && total === limit ? blockedUsers[total - 1].id : undefined

      const response: GetBlockedUsersResponse = successCollectionResponse(
        blockedUsers.map(mapBlockedUserModelToBlockedUser),
        total,
        nextCursor,
      )

      return c.json(response)
    },
  )
  .get(
    "/:blockedUserId/is-blocked",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const { blockedUserId } = c.req.param()
      const { userId } = c.get("userProfile")

      if (userId === blockedUserId) {
        const response: GetIsBlockedUserResponse = successResponse(false)
        return c.json(response)
      }

      const blockedProfile = await prisma.profile.findUnique({
        where: { userId: blockedUserId },
      })
      if (!blockedProfile) {
        throw new InvariantError(ERROR.USER_NOT_FOUND)
      }

      const blockedUser = await prisma.blockedUser.findFirst({
        select: { id: true },
        where: { blockedUserId, userId, unblockedAt: null },
        take: 1,
      })
      if (!blockedUser) {
        const response: GetIsBlockedUserResponse = successResponse(false)
        return c.json(response)
      }

      const response: GetIsBlockedUserResponse = successResponse(true)
      return c.json(response)
    },
  )
  .post(
    "/:blockedUserId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const { blockedUserId } = c.req.param()
      const { userId } = c.get("userProfile")

      if (userId === blockedUserId) {
        throw new AuthorizationError(ERROR.CANNOT_BLOCK_IT_SELF)
      }

      const blockedProfile = await prisma.profile.findUnique({
        where: { userId: blockedUserId },
      })
      if (!blockedProfile) {
        throw new NotFoundError(ERROR.USER_NOT_FOUND)
      }

      const blockedUsers = await prisma.blockedUser.findMany({
        select: { id: true },
        where: { blockedUserId, userId, unblockedAt: null },
        take: 1,
      })
      if (blockedUsers.length > 0) {
        throw new InvariantError(ERROR.USER_ALREADY_BLOCKED)
      }

      const result = await blockUser({ userId, blockedUserId })

      const response: BlockUserResponse = successResponse({ id: result.id })
      return c.json(response)
    },
  )
  .delete(
    "/:blockedUserId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const { blockedUserId } = c.req.param()
      const { userId } = c.get("userProfile")

      const blockedUsers = await prisma.blockedUser.findMany({
        where: { userId, blockedUserId },
      })
      if (blockedUsers.length === 0) {
        throw new NotFoundError(ERROR.BLOCKED_USER_NOT_FOUND)
      }

      await unblockUser({ blockedUserId, userId })

      const response: UnblockUserResponse = successResponse({
        id: blockedUserId,
      })
      return c.json(response)
    },
  )

export default blockedUserApp
