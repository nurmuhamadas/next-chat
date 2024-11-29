import "server-only"

import { createMiddleware } from "hono/factory"
import { Query } from "node-appwrite"

import { ERROR } from "@/constants/error"

import { APPWRITE_USERS_ID, DATABASE_ID } from "./appwrite/config"
import { createSessionClient } from "./appwrite"
import { createError } from "./utils"

/** Check if user already complete the profile */
export const validateProfileMiddleware = createMiddleware(async (c, next) => {
  const { account, databases } = await createSessionClient()

  const user = await account.get()

  const profile = await databases.listDocuments(
    DATABASE_ID,
    APPWRITE_USERS_ID,
    [Query.equal("email", user.email)],
  )

  if (profile.total === 0) {
    return c.json(createError(ERROR.COMPLETE_PROFILE_FIRST), 403)
  }

  await next()
})
