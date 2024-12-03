import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { searchQuerySchema } from "@/constants"
import { ERROR } from "@/constants/error"
import { getUserProfileById } from "@/features/user/lib/queries"
import { constructFileUrl } from "@/lib/appwrite"
import { sessionMiddleware } from "@/lib/session-middleware"
import { deleteImage, uploadImage } from "@/lib/upload-image"
import {
  createError,
  successCollectionResponse,
  successResponse,
} from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"
import { zodErrorHandler } from "@/lib/zod-error-handler"

import {
  createChannelOption,
  deleteChannelOption,
  getChannelOption,
  updateChannelOption,
} from "../lib/channel-option-queries"
import {
  checkChannelNameAvailablity,
  createChannel,
  createChannelInviteCode,
  getChannelById,
  getChannelOwnersByUserIds,
  getChannelsByUserId,
  searchChannels,
  validateJoinCode,
} from "../lib/channel-queries"
import {
  createChannelSubscriber,
  deleteAllChannelSubs,
  getChannelSubs,
  getCurrentChannelSubs,
  leaveChannel,
  setUserAsAdmin,
  unsetUserAdmin,
  validateChannelAdmin,
  validateChannelSubs,
} from "../lib/channel-subscribers-queries"
import {
  mapChannelModelToChannel,
  mapChannelOptModelToChannelOpt,
  mapUserModelToChannelOwner,
} from "../lib/utils"
import {
  channelSchema,
  joinChannelSchema,
  updateChannelOptionSchema,
} from "../schema"

const channelApp = new Hono()
  .get("/", sessionMiddleware, validateProfileMiddleware, async (c) => {
    try {
      const databases = c.get("databases")
      const currentProfile = c.get("userProfile")

      const result = await getChannelsByUserId(databases, {
        userId: currentProfile.$id,
      })

      const ownerIds = result.documents.map((v) => v.ownerId)
      const { data: owners } = await getChannelOwnersByUserIds(databases, {
        userIds: ownerIds,
      })

      const mappedChannel: Channel[] = result.documents.map((channel) =>
        mapChannelModelToChannel(
          channel,
          owners.find((user) => user.id === channel.ownerId)!,
          // TODO: Add last message
        ),
      )

      const response: GetChannelsResponse = successCollectionResponse(
        mappedChannel,
        result.total,
      )
      return c.json(response)
    } catch {
      return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
    }
  })
  .post(
    "/",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("form", channelSchema, zodErrorHandler),
    async (c) => {
      try {
        const { name, image, type, description } = c.req.valid("form")
        const imageFile = image as unknown as File

        const databases = c.get("databases")
        const storage = c.get("storage")
        const currentProfile = c.get("userProfile")

        const isNameAvailable = await checkChannelNameAvailablity(databases, {
          name,
        })
        if (!isNameAvailable) {
          return c.json(createError(ERROR.CHANNEL_NAME_ALREADY_EXIST), 400)
        }

        let imageUrl: string | undefined
        let fileId: string | undefined
        if (imageFile) {
          const file = await uploadImage(storage, { image: imageFile })
          fileId = file.$id
          imageUrl = constructFileUrl(file.$id)
        }

        try {
          const inviteCode = await createChannelInviteCode(databases)

          const createdChannel = await createChannel(databases, {
            name,
            description,
            type,
            imageUrl,
            ownerId: currentProfile.$id,
            inviteCode,
          })
          await createChannelOption(databases, {
            channelId: createdChannel.$id,
            userId: currentProfile.$id,
            notification: true,
          })
          await createChannelSubscriber(databases, {
            userId: currentProfile.$id,
            channelId: createdChannel.$id,
            isAdmin: true,
          })

          const channelResult = mapChannelModelToChannel(
            createdChannel,
            mapUserModelToChannelOwner(currentProfile),
          )

          const response: CreateChannelResponse = successResponse(channelResult)
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
  .get(
    "/search",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("query", searchQuerySchema, zodErrorHandler),
    async (c) => {
      try {
        const { query, limit, offset } = c.req.valid("query")

        const databases = c.get("databases")

        const result = await searchChannels(databases, { query, limit, offset })

        const response: SearchChannelsResponse = successCollectionResponse(
          result.data,
          result.total,
        )
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get(
    "/:channelId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { channelId } = c.req.param()

        const databases = c.get("databases")
        const profile = c.get("userProfile")

        const channel = await getChannelById(databases, {
          id: channelId,
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const isSubscriber = await validateChannelSubs(databases, {
          userId: profile.$id,
          channelId,
        })
        if (channel.type === "PRIVATE" && !isSubscriber) {
          return c.json(createError(ERROR.NOT_ALLOWED), 403)
        }

        const owner = await getUserProfileById(databases, {
          userId: channel.ownerId,
        })
        if (!owner) {
          return c.json(createError(ERROR.CHANNEL_OWNER_NOT_FOUND), 404)
        }

        const mappedChannels: Channel = mapChannelModelToChannel(
          channel,
          mapUserModelToChannelOwner(owner),
        )

        const response: GetChannelResponse = successResponse(mappedChannels)
        return c.json(response)
      } catch (e) {
        console.log(e)
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get(
    "/:channelId/subscribers",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { channelId } = c.req.param()

        const databases = c.get("databases")
        const profile = c.get("userProfile")

        const channel = await getChannelById(databases, {
          id: channelId,
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const isMember = await validateChannelSubs(databases, {
          userId: profile.$id,
          channelId,
        })
        if (channel.type === "PRIVATE" && !isMember) {
          return c.json(createError(ERROR.NOT_ALLOWED), 403)
        }

        const result = await getChannelSubs(databases, { channelId })

        const response: GetChannelSubscribersResponse =
          successCollectionResponse(result.data, result.total)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post(
    "/:channelId/subscribers/:userId/admin",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { channelId, userId } = c.req.param()

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const channel = await getChannelById(databases, {
          id: channelId,
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const isAdmin = await validateChannelAdmin(databases, {
          userId: currentProfile.$id,
          channelId,
        })
        if (!isAdmin) {
          return c.json(createError(ERROR.ONLY_ADMIN_CAN_ADD_ADMIN), 403)
        }

        const isSubs = await validateChannelSubs(databases, {
          userId,
          channelId,
        })
        if (!isSubs) {
          return c.json(createError(ERROR.USER_IS_NOT_SUBSCRIBER), 403)
        }

        const isAlreadyAdmin = await validateChannelAdmin(databases, {
          userId,
          channelId,
        })
        if (isAlreadyAdmin) {
          return c.json(createError(ERROR.USER_ALREADY_ADMIN), 400)
        }

        await setUserAsAdmin(databases, { userId, channelId })

        const response: SetAdminChannelResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .delete(
    "/:channelId/subscribers/:userId/admin",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { channelId, userId } = c.req.param()

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const channel = await getChannelById(databases, {
          id: channelId,
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const isAdmin = await validateChannelAdmin(databases, {
          userId: currentProfile.$id,
          channelId,
        })
        if (!isAdmin) {
          return c.json(createError(ERROR.ONLY_ADMIN_CAN_REMOVE_ADMIN), 403)
        }

        const isSubs = await validateChannelSubs(databases, {
          userId,
          channelId,
        })
        if (!isSubs) {
          return c.json(createError(ERROR.USER_IS_NOT_SUBSCRIBER), 403)
        }

        const isAlreadyAdmin = await validateChannelAdmin(databases, {
          userId,
          channelId,
        })
        if (!isAlreadyAdmin) {
          return c.json(createError(ERROR.USER_IS_NOT_ADMIN), 400)
        }

        await unsetUserAdmin(databases, { userId, channelId })

        const response: UnsetAdminChannelResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post(
    "/:channelId/join",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("json", joinChannelSchema, zodErrorHandler),
    async (c) => {
      try {
        const { code } = c.req.valid("json")
        const { channelId } = c.req.param()

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const channel = await getChannelById(databases, {
          id: channelId,
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const isMember = await validateChannelSubs(databases, {
          userId: currentProfile.$id,
          channelId,
        })
        if (isMember) {
          return c.json(createError(ERROR.ALREADY_SUBSCRIBER), 403)
        }

        const isJoinCodeValid = await validateJoinCode(databases, {
          channelId,
          code,
        })
        if (!isJoinCodeValid) {
          return c.json(createError(ERROR.INVALID_JOIN_CODE), 400)
        }

        await createChannelSubscriber(databases, {
          channelId,
          userId: currentProfile.$id,
          isAdmin: false,
        })
        await createChannelOption(databases, {
          channelId,
          userId: currentProfile.$id,
          notification: true,
        })

        const response: JoinChannelResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .delete(
    "/:channelId/left",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { channelId } = c.req.param()

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const channel = await getChannelById(databases, {
          id: channelId,
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const isSubs = await validateChannelSubs(databases, {
          userId: currentProfile.$id,
          channelId,
        })
        if (!isSubs) {
          return c.json(createError(ERROR.USER_IS_NOT_SUBSCRIBER), 403)
        }

        const isAdmin = await validateChannelAdmin(databases, {
          userId: currentProfile.$id,
          channelId,
        })
        if (isAdmin) {
          const subs = await getChannelSubs(databases, { channelId })
          const admins = subs.data.filter((v) => v.isAdmin)
          if (admins.length === 1 && subs.total > 1) {
            const subsWithoutUser = subs.data.filter(
              (v) => v.id !== currentProfile.$id,
            )

            await setUserAsAdmin(databases, {
              userId: subsWithoutUser[0].id,
              channelId,
            })
          }
        }

        await leaveChannel(databases, {
          channelId: channel.$id,
          userId: currentProfile.$id,
        })
        await deleteChannelOption(databases, {
          channelId,
          userId: currentProfile.$id,
        })

        const response: LeaveChannelResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .delete(
    "/:channelId/chat",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { channelId } = c.req.param()

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const channel = await getChannelById(databases, {
          id: channelId,
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const currentMember = await getCurrentChannelSubs(databases, {
          channelId,
          userId: currentProfile.$id,
        })
        if (!currentMember) {
          return c.json(createError(ERROR.USER_IS_NOT_SUBSCRIBER), 403)
        }

        await leaveChannel(databases, { channelId, userId: currentProfile.$id })

        await deleteAllChannelSubs(databases, { userId: currentProfile.$id })

        await createChannelSubscriber(databases, {
          channelId,
          userId: currentProfile.$id,
          isAdmin: currentMember.isAdmin,
        })

        const response: DeleteAllChannelChatResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get(
    "/:channelId/options",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { channelId } = c.req.param()

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const channel = await getChannelById(databases, {
          id: channelId,
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const currentMember = await getCurrentChannelSubs(databases, {
          channelId,
          userId: currentProfile.$id,
        })
        if (!currentMember) {
          return c.json(createError(ERROR.USER_IS_NOT_SUBSCRIBER), 403)
        }

        const channelOption = await getChannelOption(databases, {
          channelId: channel.$id,
          userId: currentProfile.$id,
        })
        if (!channelOption) {
          return c.json(createError(ERROR.USER_IS_NOT_SUBSCRIBER), 403)
        }

        const response: GetChannelOptionResponse = successResponse(
          mapChannelOptModelToChannelOpt(channelOption),
        )
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .patch(
    "/:channelId/options",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("json", updateChannelOptionSchema),
    async (c) => {
      try {
        const { channelId } = c.req.param()
        const { notification } = c.req.valid("json")

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const channel = await getChannelById(databases, {
          id: channelId,
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const currentMember = await getCurrentChannelSubs(databases, {
          channelId,
          userId: currentProfile.$id,
        })
        if (!currentMember) {
          return c.json(createError(ERROR.USER_IS_NOT_SUBSCRIBER), 403)
        }

        const channelOption = await getChannelOption(databases, {
          channelId: channel.$id,
          userId: currentProfile.$id,
        })
        if (!channelOption) {
          return c.json(createError(ERROR.USER_IS_NOT_SUBSCRIBER), 403)
        }

        const result = await updateChannelOption(databases, channelOption.$id, {
          notification,
        })

        const response: UpdateChannelNotifResponse = successResponse(
          mapChannelOptModelToChannelOpt(result),
        )
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )

export default channelApp
