import "server-only"

import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { ERROR } from "@/constants/error"
import { constructFileUrl } from "@/lib/appwrite"
import { sessionMiddleware } from "@/lib/session-middleware"
import { deleteImage, uploadImage } from "@/lib/upload-image"
import { createError, successResponse } from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"
import { zodErrorHandler } from "@/lib/zod-error-handler"

import {
  createGroup,
  createGroupInviteCode,
  createGroupMember,
  createGroupOption,
  validateGroupData,
} from "../lib/queries"
import { mapGroupModelToGroup, mapUserModelToGroupOwner } from "../lib/utils"
import { groupSchema } from "../schema"

const groupApp = new Hono()
  .get("/")
  .post(
    "/",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("form", groupSchema, zodErrorHandler),
    async (c) => {
      try {
        const { name, image, type, memberIds, description } =
          c.req.valid("form")
        const imageFile = image as unknown as File

        const databases = c.get("databases")
        const storage = c.get("storage")
        const currentProfile = c.get("userProfile")

        const invalid = await validateGroupData(databases, currentProfile.$id, {
          name,
          description,
          type,
          memberIds,
        })
        if (invalid) {
          return c.json(createError(invalid.error, invalid.path), invalid.code)
        }

        let imageUrl: string | undefined
        let fileId: string | undefined
        if (imageFile) {
          const file = await uploadImage(storage, { image: imageFile })
          fileId = file.$id
          imageUrl = constructFileUrl(file.$id)
        }

        try {
          const inviteCode = await createGroupInviteCode(databases)

          const createdGroup = await createGroup(databases, {
            name,
            description,
            type,
            imageUrl,
            ownerId: currentProfile.$id,
            inviteCode,
          })
          await createGroupOption(databases, {
            groupId: createdGroup.$id,
            notification: true,
          })
          await createGroupMember(databases, {
            userId: currentProfile.$id,
            groupId: createdGroup.$id,
            isAdmin: true,
            joinedAt: new Date(),
          })

          await Promise.all([
            ...memberIds.map((memberId) =>
              createGroupMember(databases, {
                userId: memberId,
                groupId: createdGroup.$id,
                isAdmin: false,
                joinedAt: new Date(),
              }),
            ),
          ])
          const groupResult = mapGroupModelToGroup(
            createdGroup,
            mapUserModelToGroupOwner(currentProfile),
          )
          const response: CreateGroupResponse = successResponse(groupResult)
          return c.json(response)
        } catch {
          if (fileId) {
            await deleteImage(storage, { id: fileId })
          }
          return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
        }
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )

export default groupApp
