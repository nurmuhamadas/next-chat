import { PasswordResetToken, Session, VerificationToken } from "@prisma/client"
import { addDays, addMinutes, isBefore } from "date-fns"
import { Context } from "hono"
import { getCookie, setCookie } from "hono/cookie"
import * as jwt from "hono/jwt"

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

export const generateSessionToken = (data: {
  userId: string
  username: string
  email: string
}) => {
  return jwt.sign({ ...data, createdAt: new Date() }, AUTH_SECRET)
}

export const generateVerificationToken = (data: {
  email: string
  username: string
}) => {
  return jwt.sign(data, AUTH_SECRET)
}

export const decodeJWT = (jwt: string) => {
  const [header, payload] = jwt.split(".")
  const decodeBase64 = (str: string) =>
    Buffer.from(str, "base64url").toString("utf-8")

  const decodedHeader = JSON.parse(decodeBase64(header)) // Dekode Header
  const decodedPayload = JSON.parse(decodeBase64(payload)) // Dekode Payload

  return { header: decodedHeader, payload: decodedPayload }
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

export const validateToken = ({
  token,
  originToken,
}: {
  token: string
  originToken: VerificationToken | PasswordResetToken | null
}) => {
  if (!originToken || originToken.token !== token) {
    return ERROR.INVALID_TOKEN
  }
  if (isBefore(originToken.expiresAt, new Date())) {
    return ERROR.TOKEN_EXPIRED
  }
}

export const setAuthCookies = (c: Context, session: Session) => {
  const deviceId = getDeviceId(c)
  if (!deviceId) {
    setCookie(c, DEVICE_ID_COOKIE_KEY, session.id, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 10000,
    })
  }
  setCookie(c, AUTH_COOKIE_KEY, session.token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
  })
}

export const getDeviceId = (c: Context) => {
  return getCookie(c, DEVICE_ID_COOKIE_KEY)
}
