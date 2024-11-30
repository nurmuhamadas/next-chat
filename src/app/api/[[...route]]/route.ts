import { Hono } from "hono"
import { handle } from "hono/vercel"

import authApp from "@/features/auth/server/route"
import blockedUserApp from "@/features/blocked-users/server/route"
import groupApp from "@/features/group/server/route"
import userApp from "@/features/user/server/route"

export const runtime = "edge"

const app = new Hono().basePath("/api")

// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
const routes = app
  .route("/auth", authApp)
  .route("/users", userApp)
  .route("/blocked-users", blockedUserApp)
  .route("/groups", groupApp)

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
