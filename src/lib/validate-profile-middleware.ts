import "server-only"

import { Profile, User } from "@prisma/client"
import { createMiddleware } from "hono/factory"

import { ERROR } from "@/constants/error"
import { prisma } from "@/lib/prisma"

import { createError } from "./utils"

type AdditionalContext = {
  Variables: {
    userSession: UserSession
    userProfile: Profile & { user: Pick<User, "username"> }
  }
}

/** Check if user already complete the profile<br />
 * * **IMPORTANT** should place after sessionMiddleware
 */
export const validateProfileMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const session = c.get("userSession")

    const profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
      include: { user: { select: { username: true } } },
    })

    if (!profile) {
      return c.json(createError(ERROR.COMPLETE_PROFILE_FIRST), 403)
    }

    c.set("userProfile", profile)

    await next()
  },
)
