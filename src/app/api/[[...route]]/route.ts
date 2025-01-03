import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { Hono } from "hono"
import { logger } from "hono/logger"
import { handle } from "hono/vercel"
import { ZodError } from "zod"

import { ERROR } from "@/constants/error"
import authApp from "@/features/auth/server/route"
import blockedUserApp from "@/features/blocked-users/server/route"
import channelApp from "@/features/channel/server/route"
import roomApp from "@/features/chat/server/route"
import groupApp from "@/features/group/server/route"
import messageApp from "@/features/messages/server/route"
import privateChatApp from "@/features/private-chat/server/route"
import settingApp from "@/features/settings/server/route"
import userApp from "@/features/user/server/route"
import { customLogger } from "@/lib/custom-logger"
import ClientError from "@/lib/exceptions/client-error"
import { createError } from "@/lib/utils"
// export const runtime = "edge"

const app = new Hono().basePath("/api")

app.use(logger(customLogger))

app.onError((error, c) => {
  if (error instanceof ClientError) {
    customLogger(
      "ERROR:",
      `Message: ${error.message}`,
      `code: ${error.statusCode}`,
    )
    return c.json(createError(error.message), error.statusCode)
  }

  if (error instanceof ZodError) {
    const response = createError(
      error.errors[0]?.message,
      error.errors[0]?.path,
    )
    return c.json(response, 400)
  }

  if (error instanceof PrismaClientKnownRequestError) {
    customLogger("ERROR:", `Message: ${error.message}`)
    return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
  }

  customLogger("ERROR:", `Message: ${error.message}`)
  return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
const routes = app
  .route("/auth", authApp)
  .route("/users", userApp)
  .route("/settings", settingApp)
  .route("/blocked-users", blockedUserApp)
  .route("/private-chat", privateChatApp)
  .route("/groups", groupApp)
  .route("/channels", channelApp)
  .route("/rooms", roomApp)
  .route("/messages", messageApp)

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
