import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { deleteCookie, setCookie } from "hono/cookie"
import { AppwriteException, ID } from "node-appwrite"

import { ERROR } from "@/constants/error"
import { getSettings } from "@/features/settings/lib/queries"
import { getUserByEmail } from "@/features/user/lib/queries"
import { createAdminClient } from "@/lib/appwrite"
import { sessionMiddleware } from "@/lib/session-middleware"
import { createError, successResponse } from "@/lib/utils"
import { zodErrorHandler } from "@/lib/zod-error-handler"

import { AUTH_COOKIE_KEY } from "../constants"
import { otpSchema, signInSchema, signUpSchema } from "../schema"

const authApp = new Hono()
  .post(
    "/register",
    zValidator("json", signUpSchema, zodErrorHandler),
    async (c) => {
      try {
        const { email, password } = c.req.valid("json")

        const { account, users } = await createAdminClient()

        const existingUsers = await users.list()
        const existingUser = existingUsers.users.find(
          (user) => user.email === email,
        )

        if (existingUser) {
          const response = createError(ERROR.EMAIL_ALREADY_EXIST)
          return c.json(response, 400)
        }

        account.create(ID.unique(), email, password)

        const response: RegisterResponse = { success: true, data: true }
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post(
    "/login",
    zValidator("json", signInSchema, zodErrorHandler),
    async (c) => {
      try {
        const { email, password } = c.req.valid("json")

        const { account, users, databases } = await createAdminClient()

        const existingUsers = await users.list()
        const existingUser = existingUsers.users.find(
          (user) => user.email === email,
        )

        if (!existingUser) {
          const response = createError(ERROR.EMAIL_NOT_REGISTERED)
          return c.json(response, 400)
        }

        const user = await getUserByEmail(databases, {
          email: existingUser.email,
        })
        if (user) {
          const setting = await getSettings(databases, { userId: user?.$id })

          if (setting?.enable2FA) {
            const sessionToken = await account.createEmailToken(
              ID.unique(),
              existingUser.email,
            )
            const userId = sessionToken.userId

            const response: LoginResponse = successResponse({ otpId: userId })
            return c.json(response)
          }
        }

        const session = await account.createEmailPasswordSession(
          email,
          password,
        )

        setCookie(c, AUTH_COOKIE_KEY, session.secret, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
        })

        const response: LoginResponse = successResponse({})
        return c.json(response)
      } catch (error) {
        if (error instanceof AppwriteException) {
          if (error.type === "user_invalid_credentials") {
            const response = createError(ERROR.INVALID_CREDENTIALS)

            return c.json(response, 401)
          }
        }

        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post(
    "/verify-otp/:userId",
    zValidator("json", otpSchema, zodErrorHandler),
    async (c) => {
      try {
        const { userId } = c.req.param()
        const { code } = c.req.valid("json")

        const { account } = await createAdminClient()

        const session = await account.createSession(userId, code)

        setCookie(c, AUTH_COOKIE_KEY, session.secret, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
        })

        const response: VerifyOTPResponse = successResponse(true)
        return c.json(response)
      } catch (error) {
        if (error instanceof AppwriteException) {
          if (error.type === "user_invalid_token") {
            const response = createError(ERROR.INVALID_CODE_OR_OTP_ID)

            return c.json(response, 401)
          }
        }

        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post("/logout", sessionMiddleware, async (c) => {
    const account = c.get("account")

    deleteCookie(c, AUTH_COOKIE_KEY)
    await account.deleteSession("current")

    return c.json({ success: "true" })
  })

export default authApp
