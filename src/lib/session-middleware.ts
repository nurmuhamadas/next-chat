import "server-only"

import { isBefore } from "date-fns"
import { deleteCookie, getCookie } from "hono/cookie"
import { createMiddleware } from "hono/factory"
import { JwtTokenExpired, JwtTokenInvalid } from "hono/utils/jwt/types"

import { ERROR } from "@/constants/error"
import { AUTH_COOKIE_KEY } from "@/features/auth/constants"
import { softDeleteSession } from "@/features/auth/lib/queries"
import { verifyToken } from "@/features/auth/lib/utils"

import AuthenticationError from "./exceptions/authentication-error"
import { prisma } from "./prisma"

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
        throw ERROR.UNAUTHORIZE
      }

      const payload = await verifyToken<SessionToken>(token)

      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: { select: { id: true } } },
      })
      if (!session) {
        deleteCookie(c, AUTH_COOKIE_KEY)

        throw ERROR.UNAUTHORIZE
      }
      if (isBefore(session.expiresAt, new Date())) {
        deleteCookie(c, AUTH_COOKIE_KEY)
        await softDeleteSession({
          email: session.email,
          userId: session.user.id,
        })

        throw ERROR.UNAUTHORIZE
      }

      const userSession: UserSession = {
        ...payload,
        id: session.id,
        token,
      }

      c.set("userSession", userSession)

      await next()
    } catch (error) {
      deleteCookie(c, AUTH_COOKIE_KEY)
      if (error instanceof JwtTokenInvalid) {
        throw new AuthenticationError(ERROR.INVALID_TOKEN)
      }
      if (error instanceof JwtTokenExpired) {
        throw new AuthenticationError(ERROR.TOKEN_EXPIRED)
      }
      throw new AuthenticationError(ERROR.UNAUTHORIZE)
    }
  },
)
