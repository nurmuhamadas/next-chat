import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { searchQuerySchema } from "@/constants"
import { ERROR } from "@/constants/error"
import { createOrUpdateSession } from "@/features/auth/lib/queries"
import {
  generateDeviceId,
  generateSessionToken,
  getDeviceId,
  setAuthCookies,
} from "@/features/auth/lib/utils"
import { createSetting } from "@/features/settings/lib/queries"
import { constructFileUrl, destructFileId } from "@/lib/appwrite"
import InvariantError from "@/lib/exceptions/invariant-error"
import NotFoundError from "@/lib/exceptions/not-found-error"
import { prisma } from "@/lib/prisma"
import { sessionMiddleware } from "@/lib/session-middleware"
import { deleteFile, uploadFile } from "@/lib/upload-file"
import { successCollectionResponse, successResponse } from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"

import { createUserProfile, updateUserProfile } from "../lib/queries"
import {
  mapProfileModelToProfile,
  mapSearchForMemberResult,
  mapSearchResult,
} from "../lib/utils"
import { profileSchema } from "../schema"

const userApp = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", profileSchema),
    async (c) => {
      const userAgent = c.req.header("User-Agent") ?? "Unknown"

      const { image, ...form } = c.req.valid("form")
      const imageFile = image as unknown as File

      const { userId, email, username } = c.get("userSession")

      const profile = await prisma.profile.findUnique({
        where: { userId },
      })
      if (profile) {
        throw new InvariantError(ERROR.PROFILE_ALREADY_CREATED)
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

        const deviceId = getDeviceId(c) ?? generateDeviceId()
        const sessionToken = await generateSessionToken({
          email,
          userId,
          username,
          deviceId,
          isProfileComplete: true,
        })
        const session = await createOrUpdateSession({
          email,
          deviceId,
          token: sessionToken,
          userAgent,
          userId,
          description: `Update profile ${userAgent}`,
        })

        setAuthCookies(c, session)

        const response: CreateUserProfileResponse = successResponse(
          mapProfileModelToProfile(profile),
        )
        return c.json(response)
      } catch {
        if (fileId) {
          await deleteFile({ id: fileId })
        }

        throw new Error(ERROR.INTERNAL_SERVER_ERROR)
      }
    },
  )
  .patch(
    "/",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("form", profileSchema.partial()),
    async (c) => {
      const { image, ...form } = c.req.valid("form")
      const imageFile = image as unknown as File

      const { userId } = c.get("userSession")
      const userProfile = c.get("userProfile")

      const profile = await prisma.profile.findUnique({
        where: { userId },
      })
      if (!profile) {
        throw new Error(ERROR.CREATE_PROFILE_FIRST)
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

        throw new Error(ERROR.INTERNAL_SERVER_ERROR)
      }
    },
  )
  .get(
    "/search",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("query", searchQuerySchema),
    async (c) => {
      const { query, limit, cursor } = c.req.valid("query")

      const { userId } = c.get("userProfile")

      const result = await prisma.profile.findMany({
        where: {
          userId: { not: userId },
          OR: [
            { name: { contains: query } },
            { user: { username: { contains: query } } },
          ],
        },
        select: {
          name: true,
          imageUrl: true,
          lastSeenAt: true,
          userId: true,
        },
        take: limit,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : undefined,
      })

      const total = result.length
      const nextCursor =
        total > 0 && total === limit ? result[total - 1].userId : undefined

      const response: SearchUsersResponse = successCollectionResponse(
        result.map(mapSearchResult),
        total,
        nextCursor,
      )
      return c.json(response)
    },
  )
  .get(
    "/search-for-member/:groupId",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("query", searchQuerySchema),
    async (c) => {
      const { groupId } = c.req.param()
      const { query, limit, cursor } = c.req.valid("query")

      const { userId } = c.get("userProfile")

      const result = await prisma.profile.findMany({
        where: {
          userId: { not: userId },
          OR: [
            { name: { contains: query } },
            { user: { username: { contains: query } } },
          ],
          user: { groups: { none: { groupId, leftAt: null } } },
        },
        select: {
          name: true,
          imageUrl: true,
          lastSeenAt: true,
          userId: true,
          user: {
            select: { setting: { select: { allowAddToGroup: true } } },
          },
        },
        take: limit,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : undefined,
      })

      const total = result.length
      const nextCursor =
        total > 0 && total === limit ? result[total - 1].userId : undefined

      const response: SearchUsersForMemberResponse = successCollectionResponse(
        result.map(mapSearchForMemberResult),
        total,
        nextCursor,
      )
      return c.json(response)
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
      const { userId } = c.req.param()

      const profile = await prisma.profile.findUnique({
        where: { userId },
        select: { lastSeenAt: true },
      })

      const response: GetUserLastSeenResponse = successResponse(
        profile?.lastSeenAt?.toISOString() ?? null,
      )
      return c.json(response)
    },
  )
  .put(
    "/last-seen",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
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
    },
  )
  .get(
    "/my-profile",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const userProfile = c.get("userProfile")

      const response: GetMyProfileResponse = successResponse(
        mapProfileModelToProfile(userProfile),
      )
      return c.json(response)
    },
  )
  .get("/:userId", sessionMiddleware, validateProfileMiddleware, async (c) => {
    const { userId } = c.req.param()

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: { user: { select: { username: true, email: true } } },
    })
    if (!profile) {
      throw new NotFoundError(ERROR.PROFILE_NOT_FOUND)
    }

    const response: GetUserProfileResponse = successResponse(
      mapProfileModelToProfile(profile),
    )
    return c.json(response)
  })

export default userApp
