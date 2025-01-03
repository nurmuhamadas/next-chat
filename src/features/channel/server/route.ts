import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { collectionSchema, searchQuerySchema } from "@/constants"
import { ERROR } from "@/constants/error"
import { constructFileUrl, destructFileId } from "@/lib/appwrite"
import AuthorizationError from "@/lib/exceptions/authorization-error"
import InvariantError from "@/lib/exceptions/invariant-error"
import NotFoundError from "@/lib/exceptions/not-found-error"
import { prisma } from "@/lib/prisma"
import { sessionMiddleware } from "@/lib/session-middleware"
import { deleteFile, uploadFile } from "@/lib/upload-file"
import { successCollectionResponse, successResponse } from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"

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
  getChannelIncludeQuery,
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
    zValidator("query", searchQuerySchema),
    async (c) => {
      const { query, limit, cursor } = c.req.valid("query")
      const { userId } = c.get("userProfile")

      const result = await prisma.channel.findMany({
        where: {
          subscribers: { some: { userId, unsubscribedAt: null } },
          name: { contains: query, mode: "insensitive" },
          deletedAt: null,
        },
        include: { ...getChannelIncludeQuery({ userId }) },
        take: limit,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : undefined,
      })

      const mappedChannel: Channel[] = result.map(mapChannelModelToChannel)

      const total = result.length
      const nextCursor =
        total > 0 && total === limit ? result[total - 1].id : undefined
      const response: GetChannelsResponse = successCollectionResponse(
        mappedChannel,
        total,
        nextCursor,
      )
      return c.json(response)
    },
  )
  .post(
    "/",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("form", channelSchema),
    async (c) => {
      const { name, image, type, description } = c.req.valid("form")
      const imageFile = image as unknown as File

      const { userId } = c.get("userProfile")

      const existingChannel = await prisma.channel.findFirst({
        where: { ownerId: userId, name, deletedAt: null },
      })
      if (existingChannel) {
        throw new InvariantError(ERROR.CHANNEL_NAME_ALREADY_EXIST)
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
          subscribers: [{ isAdmin: true }],
        })

        const response: CreateChannelResponse = successResponse(channelResult)
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
    "/name-availability/:channelName",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const { channelName } = c.req.param()
      const { userId } = c.get("userProfile")

      const existingChannel = await prisma.channel.findFirst({
        where: { ownerId: userId, name: channelName, deletedAt: null },
      })

      return c.json(successResponse(!existingChannel))
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

      const result = await prisma.channel.findMany({
        where: {
          type: "PUBLIC",
          subscribers: { none: { userId, unsubscribedAt: null } },
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
    },
  )
  .get(
    "/:channelId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const { channelId } = c.req.param()

      const { userId } = c.get("userProfile")

      const channel = await prisma.channel.findUnique({
        where: {
          ...getChannelWhere(channelId, userId),
          deletedAt: undefined,
        },
        include: { ...getChannelIncludeQuery({ userId }) },
      })
      if (!channel) {
        throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
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
    },
  )
  .patch(
    "/:channelId",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("form", channelSchema.partial()),
    async (c) => {
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
        throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
      }

      const isAdmin = channel._count.subscribers > 0
      if (!isAdmin) {
        throw new AuthorizationError(ERROR.NOT_ALLOWED)
      }

      let imageUrl: string | undefined
      let fileId: string | undefined
      if (imageFile) {
        const file = await uploadFile({ file: imageFile })
        fileId = file.$id
        imageUrl = constructFileUrl(file.$id)
      }

      try {
        const updatedChannel = await updateChannel(channelId, userId, {
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

        throw new Error(ERROR.INTERNAL_SERVER_ERROR)
      }
    },
  )
  .delete(
    "/:channelId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
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
        throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
      }

      const isAdmin = channel._count.subscribers > 0
      if (!isAdmin) {
        throw new AuthorizationError(ERROR.NOT_ALLOWED)
      }

      await softDeleteChannel(channelId)

      const response: DeleteChannelResponse = successResponse({
        id: channelId,
      })
      return c.json(response)
    },
  )
  .get(
    "/:channelId/is-admin",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
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
        throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
      }

      const isAdmin = channel._count.subscribers > 0

      const response = successResponse<boolean>(isAdmin)
      return c.json(response)
    },
  )
  .get(
    "/:channelId/is-subscriber",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
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
        throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
      }

      const isMember = channel._count.subscribers > 0

      const response = successResponse<boolean>(isMember)
      return c.json(response)
    },
  )
  .get(
    "/:channelId/subscribers",
    zValidator("query", collectionSchema),
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
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
        throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
      }
      const total = channel.subscribers.length
      const nextCursor =
        total > 0 && total === limit
          ? channel.subscribers[total - 1].id
          : undefined
      const response: GetChannelSubscribersResponse = successCollectionResponse(
        channel.subscribers.map(mapChannelSubModelToChannelSub),
        total,
        nextCursor,
      )
      return c.json(response)
    },
  )
  .post(
    "/:channelId/subscribers/:userId/admin",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
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
        throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
      }

      const isAdmin = channel.subscribers.find(
        (v) => v.userId === userId,
      )?.isAdmin
      if (!isAdmin) {
        throw new AuthorizationError(ERROR.ONLY_ADMIN_CAN_ADD_ADMIN)
      }

      const subscriber = channel.subscribers.find(
        (v) => v.userId === addedAdminId,
      )

      if (!subscriber) {
        throw new AuthorizationError(ERROR.USER_IS_NOT_SUBSCRIBER)
      }

      const isAlreadyAdmin = subscriber.isAdmin
      if (isAlreadyAdmin) {
        throw new InvariantError(ERROR.USER_ALREADY_ADMIN)
      }

      await addChannelAdmin({ subscriberId: subscriber.id })

      const response: SetAdminChannelResponse = successResponse(true)
      return c.json(response)
    },
  )
  .delete(
    "/:channelId/subscribers/:userId/admin",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
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
        throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
      }

      const isAdmin = channel.subscribers.find(
        (v) => v.userId === userId,
      )?.isAdmin
      if (!isAdmin) {
        throw new AuthorizationError(ERROR.ONLY_ADMIN_CAN_REMOVE_ADMIN)
      }

      const subscriber = channel.subscribers.find(
        (v) => v.userId === removedAdminId,
      )
      if (!subscriber) {
        throw new AuthorizationError(ERROR.USER_IS_NOT_SUBSCRIBER)
      }

      const isAlreadyAdmin = subscriber.isAdmin
      if (!isAlreadyAdmin) {
        throw new InvariantError(ERROR.USER_IS_NOT_ADMIN)
      }

      await removeChannelAdmin({ subscriberId: subscriber.id })

      const response: UnsetAdminChannelResponse = successResponse(true)
      return c.json(response)
    },
  )
  .post(
    "/:channelId/join",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("json", joinChannelSchema),
    async (c) => {
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
        throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
      }

      const subscriber = channel.subscribers.find((v) => v.userId === userId)
      if (subscriber) {
        throw new InvariantError(ERROR.ALREADY_SUBSCRIBER)
      }

      if (channel.type === "PRIVATE" && channel.inviteCode !== code) {
        throw new InvariantError(ERROR.INVALID_JOIN_CODE)
      }

      await subscribeChannel({ channelId, userId })

      const response: JoinChannelResponse = successResponse(true)
      return c.json(response)
    },
  )
  .post(
    "/:channelId/left",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
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
        throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
      }

      const subs = channel.subscribers.find((v) => v.userId === userId)
      if (!subs) {
        throw new AuthorizationError(ERROR.USER_IS_NOT_SUBSCRIBER)
      }

      if (channel._count.subscribers === 1) {
        await softDeleteChannel(channelId)
        const response: LeaveChannelResponse = successResponse(true)
        return c.json(response)
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
    },
  )
  .delete(
    "/:channelId/chat",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const { channelId } = c.req.param()

      const { userId } = c.get("userProfile")

      const channel = await prisma.channel.findUnique({
        where: { ...getChannelWhere(channelId, userId) },
        include: {
          subscribers: { where: { userId, unsubscribedAt: null } },
        },
      })
      if (!channel) {
        throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
      }

      const subscriber = channel.subscribers.find((v) => v.userId === userId)
      if (!subscriber) {
        throw new AuthorizationError(ERROR.USER_IS_NOT_SUBSCRIBER)
      }

      await clearAllChannelChat({
        channelId,
        userId,
        isAdmin: subscriber.isAdmin,
      })

      const response: DeleteAllChannelChatResponse = successResponse(true)
      return c.json(response)
    },
  )
  .get(
    "/:channelId/options",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
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
        throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
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
    },
  )
  .patch(
    "/:channelId/options",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("json", updateChannelOptionSchema),
    async (c) => {
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
        throw new NotFoundError(ERROR.CHANNEL_NOT_FOUND)
      }

      const currentSub = channel.subscribers.find((v) => v.userId === userId)
      if (!currentSub) {
        throw new AuthorizationError(ERROR.USER_IS_NOT_SUBSCRIBER)
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
    },
  )

export default channelApp
