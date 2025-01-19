/* eslint-disable @typescript-eslint/no-require-imports */
import { cookies } from "next/headers"

import { PasswordResetToken, VerificationToken } from "@prisma/client"
import { isBefore } from "date-fns"
import * as jwt from "hono/jwt"
import { JwtTokenExpired, JwtTokenInvalid } from "hono/utils/jwt/types"

import { ERROR } from "@/constants/error"
import { AUTH_SECRET } from "@/lib/config"
import InvariantError from "@/lib/exceptions/invariant-error"

import { AUTH_COOKIE_KEY } from "../constants"

export const verifyToken = <T>(token: string): Promise<T> => {
  return jwt.verify(token, AUTH_SECRET) as Promise<T>
}

export const validateToken = async ({
  token,
  originToken,
}: {
  token: string
  originToken: VerificationToken | PasswordResetToken | null
}) => {
  try {
    await verifyToken(token)

    if (!originToken || originToken.token !== token) {
      throw new InvariantError(ERROR.INVALID_TOKEN)
    }
    if (isBefore(originToken.expiresAt, new Date())) {
      return ERROR.TOKEN_EXPIRED
    }
  } catch (error) {
    if (error instanceof JwtTokenInvalid) {
      throw new InvariantError(ERROR.INVALID_TOKEN)
    }
    if (error instanceof JwtTokenExpired) {
      throw new InvariantError(ERROR.TOKEN_EXPIRED)
    }
  }
}

export const validateAuth = async () => {
  try {
    const cookie = await cookies()
    const session = cookie.get(AUTH_COOKIE_KEY)
    if (!session) throw ""

    const payload = await verifyToken<SessionToken>(session?.value)

    return {
      isLoggedIn: !!payload,
      isProfileCompleted: payload.isProfileComplete,
    }
  } catch {
    return { isLoggedIn: false, isProfileCompleted: false }
  }
}
