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

import { createChannelOption } from "../lib/channel-option-queries"
import {
  checkChannelNameAvailablity,
  createChannel,
  createChannelInviteCode,
  getChannelById,
  getChannelOwnersByUserIds,
  getChannelsByUserId,
  searchChannels,
} from "../lib/channel-queries"
import {
  createChannelSubscriber,
  getChannelSubs,
  validateChannelSubs,
} from "../lib/channel-subscribers-queries"
import {
  mapChannelModelToChannel,
  mapUserModelToChannelOwner,
} from "../lib/utils"
import { channelSchema } from "../schema"

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
            notification: true,
          })
          await createChannelSubscriber(databases, {
            userId: currentProfile.$id,
            channelId: createdChannel.$id,
            isAdmin: false,
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

export default channelApp