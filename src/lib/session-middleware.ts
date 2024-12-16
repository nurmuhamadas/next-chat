import "server-only"

import { isBefore } from "date-fns"
import { deleteCookie, getCookie } from "hono/cookie"
import { createMiddleware } from "hono/factory"

import { ERROR } from "@/constants/error"
import { AUTH_COOKIE_KEY } from "@/features/auth/constants"
import { softDeleteSession } from "@/features/auth/lib/queries"
import { decodeJWT } from "@/features/auth/lib/utils"

import { prisma } from "./prisma"
import { createError } from "./utils"

type AdditionalContext = {
  Variables: {
    userSession: UserSession
  }
}

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    try {
      const token = getCookie(c, AUTH_COOKIE_KEY)

      if (!token) {
        return c.json(createError(ERROR.UNAUTHORIZE), 401)
      }

      const session = await prisma.session.findUnique({ where: { token } })
      if (!session) {
        deleteCookie(c, AUTH_COOKIE_KEY)

        return c.json(createError(ERROR.UNAUTHORIZE), 401)
      }
      if (isBefore(session.expiresAt, new Date())) {
        deleteCookie(c, AUTH_COOKIE_KEY)
        await softDeleteSession(session)

        return c.json(createError(ERROR.UNAUTHORIZE), 401)
      }

      const { payload } = decodeJWT(token)
      const userSession = {
        id: session.id,
        userId: session.userId,
        email: payload.email,
        username: payload.username,
        token,
      }

      c.set("userSession", userSession)

      await next()
    } catch {
      return c.json(createError(ERROR.UNAUTHORIZE), 401)
    }
  },
)
