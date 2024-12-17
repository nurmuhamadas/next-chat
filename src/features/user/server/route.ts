import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { searchQuerySchema } from "@/constants"
import { ERROR } from "@/constants/error"
import { createSetting } from "@/features/settings/lib/queries"
import { constructFileUrl, destructFileId } from "@/lib/appwrite"
import { prisma } from "@/lib/prisma"
import { sessionMiddleware } from "@/lib/session-middleware"
import { deleteFile, uploadFile } from "@/lib/upload-file"
import {
  createError,
  successCollectionResponse,
  successResponse,
} from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"
import { zodErrorHandler } from "@/lib/zod-error-handler"

import { createUserProfile, updateUserProfile } from "../lib/queries"
import { mapProfileModelToProfile, mapSearchResult } from "../lib/utils"
import { profileSchema } from "../schema"

const userApp = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", profileSchema, zodErrorHandler),
    async (c) => {
      try {
        const { image, ...form } = c.req.valid("form")
        const imageFile = image as unknown as File

        const { userId } = c.get("userSession")

        const profile = await prisma.profile.findUnique({
          where: { userId },
        })
        if (profile) {
          return c.json(createError(ERROR.PROFILE_ALREADY_CREATED), 400)
        }

        let imageUrl: string | undefined
        let fileId: string | undefined
        if (imageFile) {
          const file = await uploadFile({ file: imageFile })
          fileId = file.$id
          imageUrl = constructFileUrl(file.$id)
        }

        try {
          const [profile] = await prisma.$transaction([
            createUserProfile({
              ...form,
              imageUrl,
              userId,
            }),
            createSetting(userId),
          ])

          const response: CreateUserProfileResponse = successResponse(
            mapProfileModelToProfile(profile),
          )
          return c.json(response)
        } catch {
          if (fileId) {
            await deleteFile({ id: fileId })
          }

          return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
        }
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .patch(
    "/",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("form", profileSchema.partial(), zodErrorHandler),
    async (c) => {
      try {
        const { image, ...form } = c.req.valid("form")
        const imageFile = image as unknown as File

        const { userId } = c.get("userSession")
        const userProfile = c.get("userProfile")

        const profile = await prisma.profile.findUnique({
          where: { userId },
        })
        if (!profile) {
          return c.json(createError(ERROR.CREATE_PROFILE_FIRST), 400)
        }

        let imageUrl: string | undefined
        let fileId: string | undefined
        if (imageFile) {
          const file = await uploadFile({ file: imageFile })
          fileId = file.$id
          imageUrl = constructFileUrl(file.$id)
        }

        try {
          const updatedProfile = await updateUserProfile(userProfile.id, {
            ...form,
            imageUrl,
            userId,
          })

          const response: CreateUserProfileResponse = successResponse(
            mapProfileModelToProfile(updatedProfile),
          )

          // DELETE OLD IMAGE IF NEW IMAGE UPLOADED
          if (fileId && userProfile.imageUrl) {
            const oldFileId = destructFileId(userProfile.imageUrl)
            await deleteFile({ id: oldFileId })
          }

          return c.json(response)
        } catch {
          if (fileId) {
            await deleteFile({ id: fileId })
          }

          return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
        }
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get(
    "/search",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("query", searchQuerySchema),
    async (c) => {
      try {
        const { query, limit, cursor } = c.req.valid("query")

        const result = await prisma.profile.findMany({
          where: {
            OR: [
              { name: { contains: query } },
              { user: { username: { contains: query } } },
            ],
          },
          select: { id: true, name: true, imageUrl: true, lastSeenAt: true },
          take: limit,
          cursor: cursor ? { id: cursor } : undefined,
          skip: cursor ? 1 : undefined,
        })

        const nextCursor =
          result.length > 0 ? result[result.length - 1].id : undefined

        const response: SearchUsersResponse = successCollectionResponse(
          result.map(mapSearchResult),
          result.length,
          nextCursor,
        )
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get(
    "/last-seen",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const profile = c.get("userProfile")

      const response: GetUserLastSeenResponse = successResponse(
        profile.lastSeenAt?.toISOString() ?? null,
      )
      return c.json(response)
    },
  )
  .get(
    "/last-seen/:userId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { userId } = c.req.param()

        const profile = await prisma.profile.findUnique({
          where: { userId },
          select: { lastSeenAt: true },
        })

        const response: GetUserLastSeenResponse = successResponse(
          profile?.lastSeenAt?.toISOString() ?? null,
        )
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .put(
    "/last-seen",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const currentProfile = c.get("userProfile")

        const profile = await prisma.profile.update({
          where: { id: currentProfile.id },
          data: { lastSeenAt: new Date() },
          select: { lastSeenAt: true },
        })

        const response: UpdateUserLastSeenResponse = successResponse(
          profile?.lastSeenAt?.toISOString() ?? "",
        )
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get(
    "/my-profile",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const userProfile = c.get("userProfile")

        const response: GetMyProfileResponse = successResponse(
          mapProfileModelToProfile(userProfile),
        )
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get("/:userId", sessionMiddleware, validateProfileMiddleware, async (c) => {
    try {
      const { userId } = c.req.param()

      const profile = await prisma.profile.findUnique({
        where: { userId },
        include: { user: { select: { username: true } } },
      })
      if (!profile) {
        return c.json(createError(ERROR.PROFILE_NOT_FOUND), 404)
      }

      const response: GetUserProfileResponse = successResponse(
        mapProfileModelToProfile(profile),
      )
      return c.json(response)
    } catch {
      return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
    }
  })

export default userApp
