import { Hono } from "hono"
import { handle } from "hono/vercel"

import authApp from "@/features/auth/server/route"
import blockedUserApp from "@/features/blocked-users/server/route"
import channelApp from "@/features/channel/server/route"
import roomApp from "@/features/chat/server/route"
import groupApp from "@/features/group/server/route"
import messageApp from "@/features/messages/server/route"
import privateChatApp from "@/features/private-chat/server/route"
import settingApp from "@/features/settings/server/route"
import userApp from "@/features/user/server/route"

// export const runtime = "edge"

const app = new Hono().basePath("/api")

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
