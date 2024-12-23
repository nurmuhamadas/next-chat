import { PasswordResetToken, Session, VerificationToken } from "@prisma/client"
import { addDays, addMinutes, addYears, isBefore } from "date-fns"
import { Context } from "hono"
import { getCookie, setCookie } from "hono/cookie"
import * as jwt from "hono/jwt"
import { JwtTokenExpired, JwtTokenInvalid } from "hono/utils/jwt/types"
import { v7 as uuidV7 } from "uuid"

import { ERROR } from "@/constants/error"
import { AUTH_SECRET } from "@/lib/config"
import { prisma } from "@/lib/prisma"

import { AUTH_COOKIE_KEY, DEVICE_ID_COOKIE_KEY } from "../constants"

const SALT_ROUND = 10

export const hashPassword = (password: string) => {
  return Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: SALT_ROUND,
  })
}

export const comparePassword = (password: string, hashedPassword: string) => {
  return Bun.password.verify(password, hashedPassword)
}

export const generateSessionToken = (data: SessionToken) => {
  return jwt.sign(
    { ...data, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 },
    AUTH_SECRET,
  )
}

export const generateVerificationToken = (data: {
  email: string
  username: string
}) => {
  return jwt.sign(
    {
      ...data,
      createdAt: new Date(),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 10,
    },
    AUTH_SECRET,
  )
}

export const verifyToken = <T>(token: string): Promise<T> => {
  return jwt.verify(token, AUTH_SECRET) as Promise<T>
}

export const checkUsernameAvailability = async (username: string) => {
  const result = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  })

  return !result
}

export const getTokenExpired = () => addMinutes(new Date(), 10)

export const getSessionExpired = () => addDays(new Date(), 30)

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
      return ERROR.INVALID_TOKEN
    }
    if (isBefore(originToken.expiresAt, new Date())) {
      return ERROR.TOKEN_EXPIRED
    }
  } catch (error) {
    if (error instanceof JwtTokenInvalid) return ERROR.INVALID_TOKEN
    if (error instanceof JwtTokenExpired) return ERROR.TOKEN_EXPIRED
  }
}

export const setAuthCookies = (c: Context, session: Session) => {
  const deviceId = getDeviceId(c)
  if (!deviceId) {
    setCookie(c, DEVICE_ID_COOKIE_KEY, session.deviceId, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: addYears(new Date(), 1),
    })
  }
  setCookie(c, AUTH_COOKIE_KEY, session.token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: getSessionExpired(),
  })
}

export const getDeviceId = (c: Context) => {
  return getCookie(c, DEVICE_ID_COOKIE_KEY)
}

export const generateDeviceId = () => `device-${uuidV7()}-${Date.now()}`
