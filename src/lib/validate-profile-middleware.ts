import "server-only"

import { createMiddleware } from "hono/factory"

import { ERROR } from "@/constants/error"
import { getUserByEmail } from "@/features/user/lib/queries"

import { createSessionClient } from "./appwrite"
import { createError } from "./utils"

type AdditionalContext = {
  Variables: {
    userProfile: UserModel
  }
}

/** Check if user already complete the profile */
export const validateProfileMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const { account, databases } = await createSessionClient()

    const user = await account.get()

    const profile = await getUserByEmail(databases, user.email)

    if (!profile) {
      return c.json(createError(ERROR.COMPLETE_PROFILE_FIRST), 403)
    }

    c.set("userProfile", profile)

    await next()
  },
)
