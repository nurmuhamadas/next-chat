import "server-only"

import { Profile, User } from "@prisma/client"
import { createMiddleware } from "hono/factory"

import { ERROR } from "@/constants/error"
import { prisma } from "@/lib/prisma"

import AuthorizationError from "./exceptions/authorization-error"

type AdditionalContext = {
  Variables: {
    userSession: UserSession
    userProfile: Profile & { user: Pick<User, "username" | "email"> }
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
      include: { user: { select: { username: true, email: true } } },
    })

    if (!profile) {
      throw new AuthorizationError(ERROR.COMPLETE_PROFILE_FIRST)
    }

    c.set("userProfile", profile)

    await next()
  },
)
