import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { ID } from "node-appwrite"

import { ERROR } from "@/constants/error"
import { constructFileUrl, destructFileId } from "@/lib/appwrite"
import {
  APPWRITE_USERS_ID,
  DATABASE_ID,
  STORAGE_ID,
} from "@/lib/appwrite/config"
import { sessionMiddleware } from "@/lib/session-middleware"
import { deleteImage, uploadImage } from "@/lib/upload-image"
import { createError } from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"
import { zodErrorHandler } from "@/lib/zod-error-handler"

import {
  checkUsernameIsExist,
  getUserProfileById,
  searchUser,
  updateLastSeenByUserId,
} from "../lib/queries"
import { mapSearchResult, mapUserModelToUser } from "../lib/utils"
import { profileSchema as profileSchema, searchQuerySchema } from "../schema"

const userApp = new Hono()
  .get("/check-username/:username", sessionMiddleware, async (c) => {
    const { username } = c.req.param()

    const databases = c.get("databases")

    const isUsernameExist = await checkUsernameIsExist(databases, username)

    const response: CheckUsernameResponse = {
      success: true,
      data: isUsernameExist,
    }
    return c.json(response)
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", profileSchema, zodErrorHandler),
    async (c) => {
      const { username, image, ...form } = c.req.valid("form")
      const imageFile = image as unknown as File

      const databases = c.get("databases")
      const storage = c.get("storage")
      const userAccount = c.get("userAccount")

      const isUsernameExist = await checkUsernameIsExist(databases, username)
      if (isUsernameExist) {
        return c.json(createError(ERROR.USERNAME_ALREADY_EXIST), 400)
      }

      let imageUrl: string | undefined
      let fileId: string | undefined
      if (imageFile) {
        const file = await uploadImage({ image: imageFile, storage })
        fileId = file.$id
        imageUrl = constructFileUrl(file.$id)
      }

      try {
        const result = await databases.createDocument<UserModel>(
          DATABASE_ID,
          APPWRITE_USERS_ID,
          ID.unique(),
          {
            ...form,
            email: userAccount.email,
            username,
            imageUrl,
          },
        )

        const response: CreateUserProfileResponse = {
          success: true,
          data: mapUserModelToUser(result),
        }
        return c.json(response)
      } catch {
        if (fileId) {
          await storage.deleteFile(STORAGE_ID, fileId)
        }

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
      const databases = c.get("databases")
      const storage = c.get("storage")
      const userAccount = c.get("userAccount")
      const currentProfile = c.get("userProfile")

      if (userAccount.email !== currentProfile.email) {
        return c.json(createError(ERROR.UNAUTHORIZE), 401)
      }

      const { username, image, ...form } = c.req.valid("form")
      const imageFile = image ? (image as unknown as File) : undefined

      if (username) {
        const isUsernameExist = await checkUsernameIsExist(databases, username)
        if (username !== currentProfile.username && isUsernameExist) {
          return c.json(createError(ERROR.USERNAME_ALREADY_EXIST), 400)
        }
      }

      let imageUrl = currentProfile.imageUrl
      let fileId: string | undefined
      if (imageFile) {
        const file = await uploadImage({ image: imageFile, storage })
        fileId = file.$id
        imageUrl = constructFileUrl(file.$id)
      }

      try {
        const result = await databases.updateDocument<UserModel>(
          DATABASE_ID,
          APPWRITE_USERS_ID,
          currentProfile.$id,
          {
            ...form,
            username,
            imageUrl,
          },
        )

        const response: PatchUserProfileResponse = {
          success: true,
          data: mapUserModelToUser(result),
        }

        // DELETE OLD IMAGE IF NEW IMAGE UPLOADED
        if (fileId && currentProfile.imageUrl) {
          const oldFileId = destructFileId(currentProfile.imageUrl)
          await deleteImage({ id: oldFileId, storage })
        }

        return c.json(response)
      } catch (error) {
        if (fileId) {
          await storage.deleteFile(STORAGE_ID, fileId)
        }
        console.log(error)

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
      const { query, limit, offset } = c.req.valid("query")

      const databases = c.get("databases")

      const result = await searchUser(databases, { query, limit, offset })
      const response: SearchUsersResponse = {
        success: true,
        data: result.documents.map(mapSearchResult),
        total: result.total,
      }

      return c.json(response)
    },
  )
  .get(
    "/last-seen",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const profile = c.get("userProfile")

      const response: GetUserLastSeenResponse = {
        success: true,
        data: profile.lastSeenAt ?? null,
      }

      return c.json(response)
    },
  )
  .get(
    "/last-seen/:userId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const { userId } = c.req.param()
      const databases = c.get("databases")

      const profile = await getUserProfileById(databases, userId)

      const response: GetUserLastSeenResponse = {
        success: true,
        data: profile?.lastSeenAt ?? null,
      }

      return c.json(response)
    },
  )
  .put(
    "/last-seen",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const databases = c.get("databases")
      const currentProfile = c.get("userProfile")

      const lastSeenAt = await updateLastSeenByUserId(
        databases,
        currentProfile.$id,
      )

      if (!lastSeenAt) {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }

      const response: UpdateUserLastSeenResponse = {
        success: true,
        data: lastSeenAt,
      }

      return c.json(response)
    },
  )
  .get(
    "/my-profile",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const userProfile = c.get("userProfile")

      const response: GetMyProfileResponse = {
        success: true,
        data: mapUserModelToUser(userProfile),
      }

      return c.json(response)
    },
  )
  .get("/:userId", sessionMiddleware, validateProfileMiddleware, async (c) => {
    const { userId } = c.req.param()

    const databases = c.get("databases")

    const profile = await getUserProfileById(databases, userId)
    if (!profile) {
      return c.json(createError(ERROR.PROFILE_NOT_FOUND), 404)
    }

    const response: GetUserProfileResponse = {
      success: true,
      data: mapUserModelToUser(profile),
    }

    return c.json(response)
  })

export default userApp
