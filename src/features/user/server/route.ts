import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { ERROR } from "@/constants/error"
import { createUserSetting } from "@/features/settings/lib/queries"
import { constructFileUrl, destructFileId } from "@/lib/appwrite"
import { sessionMiddleware } from "@/lib/session-middleware"
import { deleteFile, uploadFile } from "@/lib/upload-file"
import {
  createError,
  successCollectionResponse,
  successResponse,
} from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"
import { zodErrorHandler } from "@/lib/zod-error-handler"

import {
  checkUsernameIsExist,
  createUserProfile,
  getUserProfileById,
  searchUser,
  updateLastSeenByUserId,
  updateUserProfile,
} from "../lib/queries"
import { mapSearchResult, mapUserModelToUser } from "../lib/utils"
import { profileSchema as profileSchema, searchQuerySchema } from "../schema"

const userApp = new Hono()
  .get("/username-availability/:username", sessionMiddleware, async (c) => {
    try {
      const { username } = c.req.param()

      const databases = c.get("databases")

      const isUsernameAvailable = await checkUsernameIsExist(databases, {
        username,
      })

      const response: CheckUsernameResponse =
        successResponse(isUsernameAvailable)
      return c.json(response)
    } catch {
      return c.json(createError(ERROR.INTERNAL_SERVER_ERROR))
    }
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", profileSchema, zodErrorHandler),
    async (c) => {
      try {
        const { username, image, ...form } = c.req.valid("form")
        const imageFile = image as unknown as File

        const databases = c.get("databases")
        const storage = c.get("storage")
        const userAccount = c.get("userAccount")

        const isUsernameAvailable = await checkUsernameIsExist(databases, {
          username,
        })
        if (!isUsernameAvailable) {
          return c.json(createError(ERROR.USERNAME_ALREADY_EXIST), 400)
        }

        let imageUrl: string | undefined
        let fileId: string | undefined
        if (imageFile) {
          const file = await uploadFile(storage, { image: imageFile })
          fileId = file.$id
          imageUrl = constructFileUrl(file.$id)
        }

        try {
          const result = await createUserProfile(databases, {
            ...form,
            email: userAccount.email,
            username,
            imageUrl,
          })
          await createUserSetting(databases, { userId: result.$id })

          const response: CreateUserProfileResponse = successResponse(
            mapUserModelToUser(result),
          )
          return c.json(response)
        } catch {
          if (fileId) {
            await deleteFile(storage, { id: fileId })
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
        const databases = c.get("databases")
        const storage = c.get("storage")
        const currentProfile = c.get("userProfile")

        const { username, image, ...form } = c.req.valid("form")
        const imageFile = image ? (image as unknown as File) : undefined

        if (username) {
          const isUsernameExist = await checkUsernameIsExist(databases, {
            username,
          })
          if (username !== currentProfile.username && isUsernameExist) {
            return c.json(createError(ERROR.USERNAME_ALREADY_EXIST), 400)
          }
        }

        let imageUrl = currentProfile.imageUrl
        let fileId: string | undefined
        if (imageFile) {
          const file = await uploadFile(storage, { image: imageFile })
          fileId = file.$id
          imageUrl = constructFileUrl(file.$id)
        }

        try {
          const result = await updateUserProfile(
            databases,
            currentProfile.$id,
            {
              ...form,
              username,
              imageUrl,
            },
          )

          const response: PatchUserProfileResponse = successResponse(
            mapUserModelToUser(result),
          )

          // DELETE OLD IMAGE IF NEW IMAGE UPLOADED
          if (fileId && currentProfile.imageUrl) {
            const oldFileId = destructFileId(currentProfile.imageUrl)
            await deleteFile(storage, { id: oldFileId })
          }

          return c.json(response)
        } catch {
          if (fileId) {
            await deleteFile(storage, { id: fileId })
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
        const { query, limit, offset } = c.req.valid("query")

        const databases = c.get("databases")

        const result = await searchUser(databases, { query, limit, offset })

        const response: SearchUsersResponse = successCollectionResponse(
          result.documents.map(mapSearchResult),
          result.total,
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
        profile.lastSeenAt ?? null,
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
        const databases = c.get("databases")

        const profile = await getUserProfileById(databases, { userId })

        const response: GetUserLastSeenResponse = successResponse(
          profile?.lastSeenAt ?? null,
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
        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const lastSeenAt = await updateLastSeenByUserId(databases, {
          id: currentProfile.$id,
        })

        const response: UpdateUserLastSeenResponse = successResponse(lastSeenAt)
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
      const userProfile = c.get("userProfile")

      const response: GetMyProfileResponse = successResponse(
        mapUserModelToUser(userProfile),
      )
      return c.json(response)
    },
  )
  .get("/:userId", sessionMiddleware, validateProfileMiddleware, async (c) => {
    try {
      const { userId } = c.req.param()

      const databases = c.get("databases")

      const profile = await getUserProfileById(databases, { userId })
      if (!profile) {
        return c.json(createError(ERROR.PROFILE_NOT_FOUND), 404)
      }

      const response: GetUserProfileResponse = successResponse(
        mapUserModelToUser(profile),
      )
      return c.json(response)
    } catch {
      return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
    }
  })

export default userApp
