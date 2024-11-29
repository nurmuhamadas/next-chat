import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { ID } from "node-appwrite"

import { ERROR } from "@/constants/error"
import { constructFileUrl, createSessionClient } from "@/lib/appwrite"
import {
  APPWRITE_USERS_ID,
  DATABASE_ID,
  STORAGE_ID,
} from "@/lib/appwrite/config"
import { sessionMiddleware } from "@/lib/sessionMiddleware"
import { uploadImage } from "@/lib/uploadImage"
import { createError } from "@/lib/utils"
import { zodErrorHandler } from "@/lib/zodErrorHandler"

import { checkUsernameIsExist } from "../lib/queries"
import { mapUserModelToUser } from "../lib/utils"
import { profileSchema } from "../schema"

const userApp = new Hono()
  .get("/check-username/:username", sessionMiddleware, async (c) => {
    const { username } = c.req.param()

    const { databases } = await createSessionClient()
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

      const { databases, storage, account } = await createSessionClient()

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

      const user = await account.get()

      try {
        const result = await databases.createDocument<UserModel>(
          DATABASE_ID,
          APPWRITE_USERS_ID,
          ID.unique(),
          {
            ...form,
            email: user.email,
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

export default userApp
