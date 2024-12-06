import type { NextRequest } from "next/server"

import { validateAuth } from "./features/auth/lib/queries"
import {
  apiPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./routes"

export async function middleware(request: NextRequest) {
  const { nextUrl } = request

  const isApiRoute = nextUrl.pathname.startsWith(apiPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isCompletingProfile = nextUrl.pathname === "/complete-profile"

  if (isApiRoute) return

  const { isLoggedIn, isProfileCompleted } = await validateAuth()

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.toString()),
      )
    }

    return
  }

  if (!isPublicRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/sign-in", nextUrl.toString()))
    }

    // LOGGED IN
    if (isProfileCompleted && isCompletingProfile) {
      return Response.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.toString()),
      )
    }
    if (!isProfileCompleted && !isCompletingProfile) {
      return Response.redirect(new URL("/complete-profile", nextUrl.toString()))
    }
  }

  return
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
