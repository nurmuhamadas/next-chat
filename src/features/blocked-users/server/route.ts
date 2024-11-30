import { Hono } from "hono"

import { ERROR } from "@/constants/error"
import { sessionMiddleware } from "@/lib/session-middleware"
import { createError } from "@/lib/utils"
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
    const databases = c.get("databases")
    const currentProfile = c.get("userProfile")

    const blockedUsers = await getBlockedUsersByUserId(
      databases,
      currentProfile.$id,
    )

    const response: GetBlockedUsersResponse = {
      success: true,
      data: blockedUsers.documents.map(mapUserModelToBlockedUser),
    }

    return c.json(response)
  })
  .post(
    "/:blockedUserId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const { blockedUserId } = c.req.param()
      const databases = c.get("databases")
      const currentProfile = c.get("userProfile")

      const blockedUser = await getBlockedUser(
        databases,
        currentProfile.$id,
        blockedUserId,
      )
      if (blockedUser) {
        return c.json(createError(ERROR.USER_ALREADY_BLOCKED), 400)
      }

      const result = await blockUser(
        databases,
        currentProfile.$id,
        blockedUserId,
      )

      if (!result) {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }

      const response: BlockUserResponse = {
        success: true,
        data: {
          id: result.$id,
        },
      }
      return c.json(response)
    },
  )
  .delete(
    "/:blockedUserId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const { blockedUserId } = c.req.param()
      const databases = c.get("databases")
      const currentProfile = c.get("userProfile")

      const blockedUser = await getBlockedUser(
        databases,
        currentProfile.$id,
        blockedUserId,
      )
      if (!blockedUser) {
        return c.json(createError(ERROR.BLOCKED_USER_NOT_FOUND))
      }

      await unblockUser(databases, blockedUser.$id)

      const response: UnblockUserResponse = {
        success: true,
        data: {
          id: blockedUser.$id,
        },
      }
      return c.json(response)
    },
  )

export default blockedUserApp
