import type { NextRequest } from "next/server"

import { createI18nMiddleware } from "next-international/middleware"

import { validateAuth } from "./features/auth/lib/utils"
import {
  apiPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./routes"

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "id"],
  defaultLocale: "en",
  urlMappingStrategy: "rewrite",
})

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

    return I18nMiddleware(request)
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

  return I18nMiddleware(request)
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
