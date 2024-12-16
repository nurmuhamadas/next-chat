import "server-only"

import { Profile } from "@prisma/client"
import { createMiddleware } from "hono/factory"

import { ERROR } from "@/constants/error"
import { getProfileByUserId } from "@/features/user/lib/queries"

import { createError } from "./utils"

type AdditionalContext = {
  Variables: {
    userSession: UserSession
    userProfile: Profile
  }
}

/** Check if user already complete the profile<br />
 * * **IMPORTANT** should place after sessionMiddleware
 */
export const validateProfileMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const session = c.get("userSession")

    const profile = await getProfileByUserId(session.userId)

    if (!profile) {
      return c.json(createError(ERROR.COMPLETE_PROFILE_FIRST), 403)
    }

    c.set("userProfile", profile)

    await next()
  },
)
