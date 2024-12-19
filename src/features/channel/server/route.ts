import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { collectionSchema, searchQuerySchema } from "@/constants"
import { ERROR } from "@/constants/error"
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

import {
  createChannelOption,
  updateChannelOption,
} from "../lib/channel-option-queries"
import {
  createChannel,
  createChannelInviteCode,
  softDeleteChannel,
  updateChannel,
} from "../lib/channel-queries"
import {
  addChannelAdmin,
  clearAllChannelChat,
  removeChannelAdmin,
  subscribeChannel,
  unSubscribeChannel,
} from "../lib/channel-subscribers-queries"
import {
  getChannelWhere,
  mapChannelModelToChannel,
  mapChannelModelToChannelSearch,
  mapChannelOptionModelToOption,
  mapChannelSubModelToChannelSub,
} from "../lib/utils"
import {
  channelSchema,
  joinChannelSchema,
  updateChannelOptionSchema,
} from "../schema"

const channelApp = new Hono()
  .get(
    "/",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("query", collectionSchema, zodErrorHandler),
    async (c) => {
      try {
        const { limit, cursor } = c.req.valid("query")
        const { userId } = c.get("userProfile")

        const result = await prisma.channel.findMany({
          where: {
            subscribers: { some: { userId, unsubscribedAt: null } },
            deletedAt: null,
          },
          include: {
            _count: {
              select: { subscribers: { where: { unsubscribedAt: null } } },
            },
          },
          take: limit,
          cursor: cursor ? { id: cursor } : undefined,
          skip: cursor ? 1 : undefined,
        })

        const mappedChannel: Channel[] = result.map(mapChannelModelToChannel)

        const total = result.length
        const nextCursor = total > 0 ? result[total - 1].id : undefined
        const response: GetChannelsResponse = successCollectionResponse(
          mappedChannel,
          total,
          nextCursor,
        )
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post(
    "/",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("form", channelSchema, zodErrorHandler),
    async (c) => {
      try {
        const { name, image, type, description } = c.req.valid("form")
        const imageFile = image as unknown as File

        const { userId } = c.get("userProfile")

        const existingChannels = await prisma.channel.findMany({
          where: { ownerId: userId, name, deletedAt: null },
        })
        if (existingChannels.length > 0) {
          return c.json(
            createError(ERROR.CHANNEL_NAME_ALREADY_EXIST, ["name"]),
            409,
          )
        }

        let imageUrl: string | undefined
        let fileId: string | undefined
        if (imageFile) {
          const file = await uploadFile({ file: imageFile })
          fileId = file.$id
          imageUrl = constructFileUrl(file.$id)
        }

        try {
          const inviteCode = await createChannelInviteCode()

          const createdChannel = await createChannel({
            name,
            description,
            type,
            imageUrl,
            ownerId: userId,
            inviteCode,
          })

          const channelResult = mapChannelModelToChannel({
            ...createdChannel,
            _count: { subscribers: 0 },
          })

          const response: CreateChannelResponse = successResponse(channelResult)
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
    zValidator("query", searchQuerySchema, zodErrorHandler),
    async (c) => {
      try {
        const { query, limit, cursor } = c.req.valid("query")

        const { userId } = c.get("userProfile")

        const result = await prisma.channel.findMany({
          where: {
            OR: [
              {
                type: "PRIVATE",
                subscribers: { some: { userId, unsubscribedAt: null } },
              },
              { type: { equals: "PUBLIC" } },
            ],
            name: { contains: query, mode: "insensitive" },
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            imageUrl: true,
            _count: {
              select: { subscribers: { where: { unsubscribedAt: null } } },
            },
          },
          take: limit,
          cursor: cursor ? { id: cursor } : undefined,
          skip: cursor ? 1 : undefined,
        })

        const total = result.length
        const nextCursor = total > 0 ? result[total - 1].id : undefined
        const response: SearchChannelsResponse = successCollectionResponse(
          result.map(mapChannelModelToChannelSearch),
          total,
          nextCursor,
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

        const { userId } = c.get("userProfile")

        const channel = await prisma.channel.findUnique({
          where: {
            ...getChannelWhere(channelId, userId),
            deletedAt: undefined,
          },
          include: {
            _count: {
              select: { subscribers: { where: { unsubscribedAt: null } } },
            },
          },
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const mappedChannel: Channel = mapChannelModelToChannel(channel)

        if (channel.deletedAt) {
          const response: GetChannelResponse = successResponse({
            ...mappedChannel,
            name: "Deleted Channel",
            imageUrl: null,
            description: null,
            totalSubscribers: 0,
          })
          return c.json(response)
        }

        const response: GetChannelResponse = successResponse(mappedChannel)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .patch(
    "/:channelId",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("form", channelSchema.partial(), zodErrorHandler),
    async (c) => {
      try {
        const { channelId } = c.req.param()
        const { userId } = c.get("userProfile")

        const { name, image, type, description } = c.req.valid("form")
        const imageFile = image as unknown as File

        const channel = await prisma.channel.findUnique({
          where: { ...getChannelWhere(channelId, userId) },
          include: {
            _count: {
              select: {
                subscribers: {
                  where: { userId, isAdmin: true, unsubscribedAt: null },
                },
              },
            },
          },
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const isAdmin = channel._count.subscribers > 0
        if (!isAdmin) {
          return c.json(createError(ERROR.NOT_ALLOWED), 403)
        }

        let imageUrl: string | undefined
        let fileId: string | undefined
        if (imageFile) {
          const file = await uploadFile({ file: imageFile })
          fileId = file.$id
          imageUrl = constructFileUrl(file.$id)
        }

        try {
          const updatedChannel = await updateChannel(channelId, {
            name,
            description,
            type,
            imageUrl,
          })

          const channelResult = mapChannelModelToChannel(updatedChannel)

          // DELETE OLD IMAGE IF NEW IMAGE UPLOADED
          if (fileId && channel.imageUrl) {
            const oldFileId = destructFileId(channel.imageUrl)
            await deleteFile({ id: oldFileId })
          }

          const response: PatchChannelResponse = successResponse(channelResult)
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
  .delete(
    "/:channelId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { channelId } = c.req.param()
        const { userId } = c.get("userProfile")

        const channel = await prisma.channel.findUnique({
          where: { ...getChannelWhere(channelId, userId) },
          include: {
            _count: {
              select: {
                subscribers: {
                  where: { userId, isAdmin: true, unsubscribedAt: null },
                },
              },
            },
          },
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const isAdmin = channel._count.subscribers > 0
        if (!isAdmin) {
          return c.json(createError(ERROR.NOT_ALLOWED), 403)
        }

        await softDeleteChannel(channelId)

        const response: DeleteChannelResponse = successResponse({
          id: channelId,
        })
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get(
    "/:channelId/is-admin",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { channelId } = c.req.param()

        const { userId } = c.get("userProfile")

        const channel = await prisma.channel.findUnique({
          where: { ...getChannelWhere(channelId, userId) },
          include: {
            _count: {
              select: {
                subscribers: {
                  where: { userId, isAdmin: true, unsubscribedAt: null },
                },
              },
            },
          },
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const isAdmin = channel._count.subscribers > 0

        const response = successResponse<boolean>(isAdmin)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get(
    "/:channelId/is-subscriber",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { channelId } = c.req.param()

        const { userId } = c.get("userProfile")

        const channel = await prisma.channel.findUnique({
          where: { ...getChannelWhere(channelId, userId) },
          include: {
            _count: {
              select: {
                subscribers: { where: { userId, unsubscribedAt: null } },
              },
            },
          },
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const isMember = channel._count.subscribers > 0

        const response = successResponse<boolean>(isMember)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get(
    "/:channelId/subscribers",
    zValidator("query", collectionSchema, zodErrorHandler),
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { channelId } = c.req.param()
        const { limit, cursor } = c.req.valid("query")

        const { userId } = c.get("userProfile")

        const channel = await prisma.channel.findUnique({
          where: { ...getChannelWhere(channelId, userId) },
          select: {
            subscribers: {
              where: { unsubscribedAt: null },
              select: {
                id: true,
                userId: true,
                isAdmin: true,
                user: {
                  select: {
                    profile: {
                      select: { name: true, imageUrl: true, lastSeenAt: true },
                    },
                  },
                },
              },
              take: limit,
              cursor: cursor ? { id: cursor } : undefined,
              skip: cursor ? 1 : 0,
            },
          },
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }
        const total = channel.subscribers.length
        const nextCursor =
          total > 0 ? channel.subscribers[total - 1].id : undefined
        const response: GetChannelSubscribersResponse =
          successCollectionResponse(
            channel.subscribers.map(mapChannelSubModelToChannelSub),
            total,
            nextCursor,
          )
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
        const { channelId, userId: addedAdminId } = c.req.param()

        const { userId } = c.get("userProfile")

        const channel = await prisma.channel.findUnique({
          where: { ...getChannelWhere(channelId, userId) },
          include: {
            subscribers: {
              where: {
                userId: { in: [userId, addedAdminId] },
                unsubscribedAt: null,
              },
            },
          },
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const isAdmin = channel.subscribers.find(
          (v) => v.userId === userId,
        )?.isAdmin
        if (!isAdmin) {
          return c.json(createError(ERROR.ONLY_ADMIN_CAN_ADD_ADMIN), 403)
        }

        const subscriber = channel.subscribers.find(
          (v) => v.userId === addedAdminId,
        )

        if (!subscriber) {
          return c.json(createError(ERROR.USER_IS_NOT_SUBSCRIBER), 403)
        }

        const isAlreadyAdmin = subscriber.isAdmin
        if (isAlreadyAdmin) {
          return c.json(createError(ERROR.USER_ALREADY_ADMIN), 400)
        }

        await addChannelAdmin({ subscriberId: subscriber.id })

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
        const { channelId, userId: removedAdminId } = c.req.param()

        const { userId } = c.get("userProfile")

        const channel = await prisma.channel.findUnique({
          where: { ...getChannelWhere(channelId, userId) },
          include: {
            subscribers: {
              where: {
                userId: { in: [userId, removedAdminId] },
                unsubscribedAt: null,
              },
            },
          },
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const isAdmin = channel.subscribers.find(
          (v) => v.userId === userId,
        )?.isAdmin
        if (!isAdmin) {
          return c.json(createError(ERROR.ONLY_ADMIN_CAN_REMOVE_ADMIN), 403)
        }

        const subscriber = channel.subscribers.find(
          (v) => v.userId === removedAdminId,
        )
        if (!subscriber) {
          return c.json(createError(ERROR.USER_IS_NOT_SUBSCRIBER), 403)
        }

        const isAlreadyAdmin = subscriber.isAdmin
        if (!isAlreadyAdmin) {
          return c.json(createError(ERROR.USER_IS_NOT_ADMIN), 400)
        }

        await removeChannelAdmin({ subscriberId: subscriber.id })

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

        const { userId } = c.get("userProfile")

        const channel = await prisma.channel.findUnique({
          where: { id: channelId, deletedAt: null },
          include: {
            subscribers: { where: { userId, unsubscribedAt: null } },
          },
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const subscriber = channel.subscribers.find((v) => v.userId === userId)
        if (subscriber) {
          return c.json(createError(ERROR.ALREADY_SUBSCRIBER), 403)
        }

        if (channel.type === "PRIVATE" && channel.inviteCode !== code) {
          return c.json(createError(ERROR.INVALID_JOIN_CODE), 400)
        }

        await subscribeChannel({ channelId, userId })

        const response: JoinChannelResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post(
    "/:channelId/left",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { channelId } = c.req.param()
        const { userId } = c.get("userProfile")

        const channel = await prisma.channel.findUnique({
          where: { ...getChannelWhere(channelId, userId) },
          include: {
            subscribers: {
              where: {
                OR: [{ userId }, { isAdmin: true }],
                unsubscribedAt: null,
              },
            },
            _count: {
              select: { subscribers: { where: { unsubscribedAt: null } } },
            },
          },
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const subs = channel.subscribers.find((v) => v.userId === userId)
        if (!subs) {
          return c.json(createError(ERROR.USER_IS_NOT_SUBSCRIBER), 403)
        }

        if (channel._count.subscribers === 1) {
          // TODO: change with delete channel
          return c.json(createError(ERROR.THE_ONLY_ONE_MEMBER), 403)
        }

        const isOnlyOneAdmin = subs.isAdmin && channel.subscribers.length === 1
        if (isOnlyOneAdmin) {
          const otherSubscriber = await prisma.channelSubscriber.findFirst({
            where: { userId: { not: userId }, channelId, unsubscribedAt: null },
          })

          if (otherSubscriber) {
            await addChannelAdmin({ subscriberId: otherSubscriber.id })
          }
        }

        await unSubscribeChannel({ subscriberId: subs.id, channelId, userId })

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

        const { userId } = c.get("userProfile")

        const channel = await prisma.channel.findUnique({
          where: { ...getChannelWhere(channelId, userId) },
          include: {
            subscribers: { where: { userId, unsubscribedAt: null } },
          },
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const subscriber = channel.subscribers.find((v) => v.userId === userId)
        if (!subscriber) {
          return c.json(createError(ERROR.USER_IS_NOT_SUBSCRIBER), 403)
        }

        await clearAllChannelChat({
          channelId,
          userId,
          isAdmin: subscriber.isAdmin,
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

        const { userId } = c.get("userProfile")

        const channel = await prisma.channel.findUnique({
          where: { ...getChannelWhere(channelId, userId) },
          include: {
            subscribers: { where: { userId, unsubscribedAt: null } },
            subscribersOption: { where: { userId } },
          },
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const currentSub = channel.subscribers.find((v) => v.userId === userId)
        if (!currentSub) {
          return c.json(successResponse(null))
        }

        const channelOption = channel.subscribersOption[0]
        if (!channelOption) {
          const option = await createChannelOption({ userId, channelId })
          const response: GetChannelOptionResponse = successResponse(
            mapChannelOptionModelToOption(option),
          )
          return c.json(response)
        }

        const response: GetChannelOptionResponse = successResponse(
          mapChannelOptionModelToOption(channelOption),
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

        const { userId } = c.get("userProfile")

        const channel = await prisma.channel.findUnique({
          where: { ...getChannelWhere(channelId, userId) },
          include: {
            subscribers: { where: { userId, unsubscribedAt: null } },
            subscribersOption: { where: { userId } },
          },
        })
        if (!channel) {
          return c.json(createError(ERROR.CHANNEL_NOT_FOUND), 404)
        }

        const currentSub = channel.subscribers.find((v) => v.userId === userId)
        if (!currentSub) {
          return c.json(createError(ERROR.USER_IS_NOT_SUBSCRIBER), 403)
        }

        const channelOption = channel.subscribersOption[0]
        if (!channelOption) {
          const option = await createChannelOption({
            userId,
            channelId,
            notification,
          })
          const response: GetChannelOptionResponse = successResponse(
            mapChannelOptionModelToOption(option),
          )
          return c.json(response)
        }

        const result = await updateChannelOption(channelOption.id, {
          notification,
        })

        const response: UpdateChannelNotifResponse = successResponse(
          mapChannelOptionModelToOption(result),
        )
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )

export default channelApp
