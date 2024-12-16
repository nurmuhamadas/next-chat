import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { deleteCookie, setCookie } from "hono/cookie"

import { ERROR } from "@/constants/error"
import { prisma } from "@/lib/prisma"
import { sessionMiddleware } from "@/lib/session-middleware"
import { createError, successResponse } from "@/lib/utils"
import { zodErrorHandler } from "@/lib/zod-error-handler"

import { AUTH_COOKIE_KEY } from "../constants"
import {
  createOrUpdateSession,
  createOrUpdateVerificationToken,
  createPasswordResetToken,
  createUserLog,
  deletePasswordResetToken,
  deleteSession,
  deleteVerificationToken,
  updateUserPassword,
  verifyUserEmail,
} from "../lib/queries"
import {
  checkUsernameAvailability,
  comparePassword,
  generateSessionToken,
  generateVerificationToken,
  getTokenExpired,
  hashPassword,
  validateToken,
} from "../lib/utils"
import {
  emailLoginSchema,
  emailPasswordResetSchema,
  emailVerificationSchema,
  passwordResetSchema,
  signInEmailSchema,
  signInSchema,
  signUpSchema,
  verifyEmailSchema,
} from "../schema"

const authApp = new Hono()
  .get("/username-availability/:username", async (c) => {
    try {
      const { username } = c.req.param()

      const isUsernameAvailable = await checkUsernameAvailability(username)

      const response: UsernameAvailabilityResponse =
        successResponse(isUsernameAvailable)
      return c.json(response)
    } catch {
      return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
    }
  })
  .post(
    "/sign-up",
    zValidator("json", signUpSchema, zodErrorHandler),
    async (c) => {
      try {
        const { username, email, password } = c.req.valid("json")

        const isUsernameAvailable = await checkUsernameAvailability(username)
        if (!isUsernameAvailable) {
          return c.json(createError(ERROR.USERNAME_ALREADY_EXIST), 409)
        }

        const existingUser = await prisma.user.findUnique({
          where: { email },
        })
        if (existingUser) {
          return c.json(createError(ERROR.EMAIL_ALREADY_EXIST), 409)
        }

        const hashedPassword = await hashPassword(password)

        const token = await generateVerificationToken({ email, username })
        await prisma.user.create({
          data: {
            username,
            email,
            password: hashedPassword,
            verificationToken: {
              create: { token, expiresAt: getTokenExpired() },
            },
          },
        })

        // TODO: send email verification

        const response: SignUpResponse = successResponse({ username, email })
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post(
    "/sign-in",
    zValidator("json", signInSchema, zodErrorHandler),
    async (c) => {
      try {
        const { email, password } = c.req.valid("json")
        const userAgent = c.req.header("User-Agent") ?? "Unknown"

        const existingUser = await prisma.user.findUnique({
          where: { email },
          include: { setting: true },
        })
        if (!existingUser) {
          return c.json(createError(ERROR.EMAIL_NOT_REGISTERED), 400)
        }

        const isPasswordValid = await comparePassword(
          password,
          existingUser.password,
        )
        if (!isPasswordValid) {
          return c.json(createError(ERROR.INVALID_CREDENTIALS), 400)
        }

        if (!existingUser.emailVerifiedAt) {
          const response: SignInResponse = successResponse({
            status: "unverified",
          })
          return c.json(response)
        }

        const setting = existingUser.setting
        if (setting?.enable2FA) {
          // TODO: send email login

          const response: SignInResponse = successResponse({ status: "2fa" })
          return c.json(response)
        }

        const token = await generateSessionToken({
          email,
          userId: existingUser.id,
          username: existingUser.username,
        })

        await createOrUpdateSession({
          token,
          userAgent,
          userId: existingUser.id,
          description: `Login from ${userAgent}`,
        })

        setCookie(c, AUTH_COOKIE_KEY, token, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
        })

        const response: SignInResponse = successResponse({ status: "success" })
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post(
    "/email-verification",
    zValidator("json", emailVerificationSchema, zodErrorHandler),
    async (c) => {
      try {
        const { email } = c.req.valid("json")

        const existingUser = await prisma.user.findUnique({
          where: { email },
        })
        if (!existingUser) {
          return c.json(createError(ERROR.EMAIL_NOT_REGISTERED), 400)
        }

        if (existingUser.emailVerifiedAt) {
          return c.json(createError(ERROR.EMAIL_ALREADY_VERIFIED), 403)
        }

        const token = await generateVerificationToken({
          email,
          username: existingUser.username,
        })

        await createOrUpdateVerificationToken({ email, token })

        // TODO: send email verification

        const response: EmailVerificationResponse = successResponse({ email })
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post(
    "/verify-email",
    zValidator("json", verifyEmailSchema, zodErrorHandler),
    async (c) => {
      try {
        const { email, token } = c.req.valid("json")
        const userAgent = c.req.header("User-Agent") ?? "Unknown"

        const existingUser = await prisma.user.findUnique({
          where: { email },
          include: { verificationToken: true },
        })
        if (!existingUser) {
          return c.json(createError(ERROR.EMAIL_NOT_REGISTERED), 400)
        }

        const verificationToken = existingUser.verificationToken
        const invalidToken = validateToken({
          token,
          originToken: verificationToken,
        })
        if (invalidToken) {
          return c.json(createError(invalidToken), 400)
        }

        await prisma.$transaction([
          verifyUserEmail(existingUser.id),
          deleteVerificationToken({ email }),
          createOrUpdateSession({
            token,
            userAgent,
            userId: existingUser.id,
            description: `Login from ${userAgent}`,
          }),
        ])

        setCookie(c, AUTH_COOKIE_KEY, token, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
        })

        const response: VerifyEmailResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post(
    "/email-login",
    zValidator("json", emailLoginSchema, zodErrorHandler),
    async (c) => {
      try {
        const { email } = c.req.valid("json")

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (!existingUser) {
          return c.json(createError(ERROR.EMAIL_NOT_REGISTERED), 400)
        }

        if (!existingUser.emailVerifiedAt) {
          return c.json(createError(ERROR.EMAIL_UNVERIFIED), 403)
        }

        const token = await generateSessionToken({
          email,
          userId: existingUser.id,
          username: existingUser.username,
        })
        await createOrUpdateVerificationToken({ email, token })

        // TODO: send email login

        const response: EmailLoginResponse = successResponse({ email })
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post(
    "/sign-in-email",
    zValidator("json", signInEmailSchema, zodErrorHandler),
    async (c) => {
      try {
        const { email, token } = c.req.valid("json")
        const userAgent = c.req.header("User-Agent") ?? "Unknown"

        const existingUser = await prisma.user.findUnique({
          where: { email },
          include: { verificationToken: true },
        })
        if (!existingUser) {
          return c.json(createError(ERROR.EMAIL_NOT_REGISTERED), 400)
        }

        const verificationToken = existingUser.verificationToken
        const invalidToken = validateToken({
          token,
          originToken: verificationToken,
        })
        if (invalidToken) {
          return c.json(createError(invalidToken), 400)
        }

        await prisma.$transaction([
          deleteVerificationToken({ email }),
          createOrUpdateSession({
            token,
            userAgent,
            userId: existingUser.id,
            description: `Login from ${userAgent}`,
          }),
        ])

        setCookie(c, AUTH_COOKIE_KEY, token, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
        })

        const response: VerifyEmailResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post(
    "/email-password-reset",
    zValidator("json", emailPasswordResetSchema, zodErrorHandler),
    async (c) => {
      try {
        const { email } = c.req.valid("json")

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (!existingUser) {
          return c.json(createError(ERROR.EMAIL_NOT_REGISTERED), 400)
        }

        const token = await generateVerificationToken({
          email,
          username: existingUser.username,
        })
        await createPasswordResetToken({ email, token })

        // TODO: send email password reset

        const response: EmailPasswordResetResponse = successResponse({ email })
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post(
    "/password-reset",
    zValidator("json", passwordResetSchema, zodErrorHandler),
    async (c) => {
      try {
        const { token, email, password } = c.req.valid("json")

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (!existingUser) {
          return c.json(createError(ERROR.EMAIL_NOT_REGISTERED), 400)
        }

        const passwordResetToken = await prisma.passwordResetToken.findUnique({
          where: { email, token },
        })
        const inValid = validateToken({
          token,
          originToken: passwordResetToken,
        })
        if (inValid) {
          return c.json(createError(inValid), 400)
        }

        const hashedPassword = await hashPassword(password)

        await prisma.$transaction([
          deletePasswordResetToken({ email }),
          updateUserPassword({
            id: existingUser.id,
            password: hashedPassword,
          }),
        ])

        const response: ResetPasswordResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post("/sign-out", sessionMiddleware, async (c) => {
    try {
      const session = c.get("userSession")
      const userAgent = c.req.header("User-Agent") ?? "Unknown"

      deleteCookie(c, AUTH_COOKIE_KEY)
      await deleteSession(session.token)

      await createUserLog({
        userId: session.userId,
        sessionId: session.id,
        activity: "LOGIN",
        description: `Logout from ${userAgent}`,
      })

      const response: LogoutResponse = successResponse(true)
      return c.json(response)
    } catch {}
  })

export default authApp
