import { Hono } from "hono"

import { ERROR } from "@/constants/error"
import { sessionMiddleware } from "@/lib/session-middleware"
import {
  createError,
  successCollectionResponse,
  successResponse,
} from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"

import {
  blockUser,
  getBlockedUser,
  getBlockedUsersByUserId,
  unblockUser,
} from "../lib/queries"
import { mapUserModelToBlockedUser } from "../lib/utils"

const blockedUserApp = new Hono()
  .get("/", sessionMiddleware, validateProfileMiddleware, async (c) => {
    try {
      const databases = c.get("databases")
      const currentProfile = c.get("userProfile")

      const blockedUsers = await getBlockedUsersByUserId(databases, {
        userId: currentProfile.$id,
      })

      const response: GetBlockedUsersResponse = successCollectionResponse(
        blockedUsers.documents.map(mapUserModelToBlockedUser),
        blockedUsers.total,
      )

      return c.json(response)
    } catch {
      return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
    }
  })
  .post(
    "/:blockedUserId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { blockedUserId } = c.req.param()
        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const blockedUser = await getBlockedUser(databases, {
          userId: currentProfile.$id,
          blockedUserId,
        })
        if (blockedUser) {
          return c.json(createError(ERROR.USER_ALREADY_BLOCKED), 400)
        }

        const result = await blockUser(databases, {
          userId: currentProfile.$id,
          blockedUserId,
        })

        const response: BlockUserResponse = successResponse({ id: result.$id })
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
        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const blockedUser = await getBlockedUser(databases, {
          userId: currentProfile.$id,
          blockedUserId,
        })
        if (!blockedUser) {
          return c.json(createError(ERROR.BLOCKED_USER_NOT_FOUND))
        }

        await unblockUser(databases, { id: blockedUser.$id })

        const response: UnblockUserResponse = successResponse({
          id: blockedUser.$id,
        })
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )

export default blockedUserApp
