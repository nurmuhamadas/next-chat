import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { deleteCookie, getCookie } from "hono/cookie"

import { ERROR } from "@/constants/error"
import AuthorizationError from "@/lib/exceptions/authorization-error"
import InvariantError from "@/lib/exceptions/invariant-error"
import { prisma } from "@/lib/prisma"
import { successResponse } from "@/lib/utils"

import { AUTH_COOKIE_KEY } from "../constants"
import {
  createOrUpdateSession,
  createOrUpdateVerificationToken,
  createPasswordResetToken,
  deletePasswordResetToken,
  deleteVerificationToken,
  softDeleteSession,
  updateUserPassword,
  verifyUserEmail,
} from "../lib/queries"
import {
  checkUsernameAvailability,
  comparePassword,
  generateDeviceId,
  generateSessionToken,
  generateVerificationToken,
  getDeviceId,
  getTokenExpired,
  hashPassword,
  setAuthCookies,
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
    const { username } = c.req.param()

    const isUsernameAvailable = await checkUsernameAvailability(username)

    const response: UsernameAvailabilityResponse =
      successResponse(isUsernameAvailable)
    return c.json(response)
  })
  .post("/sign-up", zValidator("json", signUpSchema), async (c) => {
    const { username, email, password } = c.req.valid("json")

    const isUsernameAvailable = await checkUsernameAvailability(username)
    if (!isUsernameAvailable) {
      throw new InvariantError(ERROR.USERNAME_ALREADY_EXIST)
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    if (existingUser) {
      throw new InvariantError(ERROR.USERNAME_ALREADY_EXIST)
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
  })
  .post("/sign-in", zValidator("json", signInSchema), async (c) => {
    const { email, password } = c.req.valid("json")
    const userAgent = c.req.header("User-Agent") ?? "Unknown"

    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        setting: { select: { enable2FA: true } },
        profile: { select: { id: true } },
      },
    })
    if (!existingUser) {
      throw new InvariantError(ERROR.EMAIL_NOT_REGISTERED)
    }

    const isPasswordValid = await comparePassword(
      password,
      existingUser.password,
    )
    if (!isPasswordValid) {
      throw new InvariantError(ERROR.INVALID_CREDENTIALS)
    }

    if (!existingUser.emailVerifiedAt) {
      const response: SignInResponse = successResponse({
        status: "unverified",
      })
      return c.json(response)
    }

    const setting = existingUser.setting
    if (setting?.enable2FA) {
      const token = await generateVerificationToken({
        email,
        username: existingUser.username,
      })
      await createOrUpdateVerificationToken({ email, token })
      // TODO: send email login

      const response: SignInResponse = successResponse({ status: "2fa" })
      return c.json(response)
    }

    const deviceId = getDeviceId(c) ?? generateDeviceId()
    const token = await generateSessionToken({
      email,
      userId: existingUser.id,
      username: existingUser.username,
      deviceId,
      isProfileComplete: !!existingUser.profile,
    })

    const session = await createOrUpdateSession({
      email,
      deviceId,
      token,
      userAgent,
      userId: existingUser.id,
      description: `Login from ${userAgent}`,
    })

    setAuthCookies(c, session)

    const response: SignInResponse = successResponse({ status: "success" })
    return c.json(response)
  })
  .post(
    "/email-verification",
    zValidator("json", emailVerificationSchema),
    async (c) => {
      const { email } = c.req.valid("json")

      const existingUser = await prisma.user.findUnique({
        where: { email },
      })
      if (!existingUser) {
        throw new InvariantError(ERROR.EMAIL_NOT_REGISTERED)
      }

      if (existingUser.emailVerifiedAt) {
        throw new InvariantError(ERROR.EMAIL_ALREADY_VERIFIED)
      }

      const token = await generateVerificationToken({
        email,
        username: existingUser.username,
      })

      await createOrUpdateVerificationToken({ email, token })

      // TODO: send email verification

      const response: EmailVerificationResponse = successResponse({ email })
      return c.json(response)
    },
  )
  .post("/verify-email", zValidator("json", verifyEmailSchema), async (c) => {
    const { email, token } = c.req.valid("json")
    const userAgent = c.req.header("User-Agent") ?? "Unknown"

    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        verificationToken: true,
        profile: { select: { id: true } },
      },
    })
    if (!existingUser) {
      throw new InvariantError(ERROR.EMAIL_NOT_REGISTERED)
    }

    const verificationToken = existingUser.verificationToken
    await validateToken({
      token,
      originToken: verificationToken,
    })

    const deviceId = getDeviceId(c) ?? generateDeviceId()
    const sessionToken = await generateSessionToken({
      email,
      userId: existingUser.id,
      username: existingUser.username,
      deviceId,
      isProfileComplete: !!existingUser.profile,
    })
    const [, , session] = await prisma.$transaction([
      verifyUserEmail(existingUser.id),
      deleteVerificationToken({ email }),
      createOrUpdateSession({
        email,
        deviceId,
        token: sessionToken,
        userAgent,
        userId: existingUser.id,
        description: `Login from ${userAgent}`,
      }),
    ])

    setAuthCookies(c, session)

    const response: VerifyEmailResponse = successResponse(true)
    return c.json(response)
  })
  .post("/email-login", zValidator("json", emailLoginSchema), async (c) => {
    const { email } = c.req.valid("json")

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (!existingUser) {
      throw new InvariantError(ERROR.EMAIL_NOT_REGISTERED)
    }

    if (!existingUser.emailVerifiedAt) {
      throw new AuthorizationError(ERROR.INVALID_CREDENTIALS)
    }

    const token = await generateVerificationToken({
      email,
      username: existingUser.username,
    })
    await createOrUpdateVerificationToken({ email, token })

    // TODO: send email login

    const response: EmailLoginResponse = successResponse({ email })
    return c.json(response)
  })
  .post("/sign-in-email", zValidator("json", signInEmailSchema), async (c) => {
    const { email, token } = c.req.valid("json")
    const userAgent = c.req.header("User-Agent") ?? "Unknown"

    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        verificationToken: true,
        profile: { select: { id: true } },
      },
    })
    if (!existingUser) {
      throw new InvariantError(ERROR.EMAIL_NOT_REGISTERED)
    }

    const verificationToken = existingUser.verificationToken
    await validateToken({
      token,
      originToken: verificationToken,
    })

    const deviceId = getDeviceId(c) ?? generateDeviceId()
    const sessionToken = await generateSessionToken({
      email,
      userId: existingUser.id,
      username: existingUser.username,
      deviceId,
      isProfileComplete: !!existingUser.profile,
    })
    const [, session] = await prisma.$transaction([
      deleteVerificationToken({ email }),
      createOrUpdateSession({
        email,
        deviceId,
        token: sessionToken,
        userAgent,
        userId: existingUser.id,
        description: `Login from ${userAgent}`,
      }),
    ])

    setAuthCookies(c, session)

    const response: VerifyEmailResponse = successResponse(true)
    return c.json(response)
  })
  .post(
    "/email-password-reset",
    zValidator("json", emailPasswordResetSchema),
    async (c) => {
      const { email } = c.req.valid("json")

      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (!existingUser) {
        throw new InvariantError(ERROR.EMAIL_NOT_REGISTERED)
      }

      const token = await generateVerificationToken({
        email,
        username: existingUser.username,
      })
      await createPasswordResetToken({ email, token })

      // TODO: send email password reset

      const response: EmailPasswordResetResponse = successResponse({ email })
      return c.json(response)
    },
  )
  .post(
    "/password-reset",
    zValidator("json", passwordResetSchema),
    async (c) => {
      const { token, email, password } = c.req.valid("json")

      const existingUser = await prisma.user.findUnique({
        where: { email },
        include: { passwordResetToken: true },
      })
      if (!existingUser) {
        throw new InvariantError(ERROR.EMAIL_NOT_REGISTERED)
      }

      await validateToken({
        token,
        originToken: existingUser.passwordResetToken,
      })

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
    },
  )
  .post("/sign-out", async (c) => {
    try {
      const token = getCookie(c, AUTH_COOKIE_KEY)

      const session = await prisma.session.findUnique({
        where: { token },
        select: { email: true, user: { select: { id: true } } },
      })

      if (session) {
        await softDeleteSession({
          email: session.email,
          userId: session.user.id,
        })
      }
      deleteCookie(c, AUTH_COOKIE_KEY)

      const response: LogoutResponse = successResponse(true)
      return c.json(response)
    } catch {
      deleteCookie(c, AUTH_COOKIE_KEY)

      const response: LogoutResponse = successResponse(true)
      return c.json(response)
    }
  })

export default authApp
