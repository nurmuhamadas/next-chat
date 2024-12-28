import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { collectionSchema, searchQuerySchema } from "@/constants"
import { ERROR } from "@/constants/error"
import { prisma } from "@/lib/prisma"
import { sessionMiddleware } from "@/lib/session-middleware"
import {
  createError,
  successCollectionResponse,
  successResponse,
} from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"

import {
  archiveRoom,
  deleteRoom,
  pinRoom,
  unarchiveRoom,
  unpinRoom,
} from "../lib/queries"
import {
  getRoomIncludeQuery,
  mapRoomModelToRoom,
  mapRoomModelToUserSearch,
} from "../lib/utils"

const roomApp = new Hono()
  .get(
    "/",
    zValidator("query", collectionSchema),
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { limit, cursor } = c.req.valid("query")
        const { userId } = c.get("userProfile")

        const result = await prisma.room.findMany({
          where: { ownerId: userId, deletedAt: null, archivedAt: null },
          include: {
            ...getRoomIncludeQuery({ userId }),
          },
          orderBy: [
            { pinnedAt: { sort: "asc", nulls: "last" } },
            { lastMessageId: { sort: "desc", nulls: "last" } },
            { createdAt: "desc" },
          ],
          take: limit,
          cursor: cursor ? { id: cursor } : undefined,
          skip: cursor ? 1 : undefined,
        })

        const roomList: Room[] = result.map(mapRoomModelToRoom)

        const total = result.length
        const nextCursor =
          total > 0 && total === limit ? result[total - 1].id : undefined
        const response: GetRoomListResponse = successCollectionResponse(
          roomList,
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
    "/search-private",
    zValidator("query", searchQuerySchema),
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { query, limit, cursor } = c.req.valid("query")
        const { userId } = c.get("userProfile")

        const result = await prisma.room.findMany({
          where: {
            OR: [
              {
                privateChat: {
                  user1: { profile: { name: { contains: query } } },
                },
              },
              {
                privateChat: {
                  user2: { profile: { name: { contains: query } } },
                },
              },
            ],
            ownerId: userId,
            deletedAt: null,
            archivedAt: null,
          },
          include: {
            privateChat: {
              select: {
                user1: {
                  select: {
                    id: true,
                    profile: {
                      select: { name: true, imageUrl: true, lastSeenAt: true },
                    },
                  },
                },
                user2: {
                  select: {
                    id: true,
                    profile: {
                      select: { name: true, imageUrl: true, lastSeenAt: true },
                    },
                  },
                },
              },
            },
          },
          orderBy: [
            { pinnedAt: { sort: "asc", nulls: "last" } },
            { lastMessageId: { sort: "desc", nulls: "last" } },
            { createdAt: "desc" },
          ],
          take: limit,
          cursor: cursor ? { id: cursor } : undefined,
          skip: cursor ? 1 : undefined,
        })

        const userSearch: UserSearch[] = result.map(mapRoomModelToUserSearch)

        const total = result.length
        const nextCursor =
          total > 0 && total === limit ? result[total - 1].id : undefined
        const response: SearchPrivateRoomResponse = successCollectionResponse(
          userSearch,
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
    "/pinned",
    zValidator("query", collectionSchema),
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { limit, cursor } = c.req.valid("query")
        const { userId } = c.get("userProfile")

        const result = await prisma.room.findMany({
          where: {
            ownerId: userId,
            deletedAt: null,
            archivedAt: null,
            pinnedAt: { not: null },
          },
          include: { ...getRoomIncludeQuery({ userId }) },
          orderBy: [
            { lastMessageId: { sort: "desc", nulls: "first" } },
            { createdAt: "desc" },
          ],
          take: limit,
          cursor: cursor ? { id: cursor } : undefined,
          skip: cursor ? 1 : undefined,
        })

        const roomList: Room[] = result.map(mapRoomModelToRoom)

        const total = result.length
        const nextCursor =
          total > 0 && total === limit ? result[total - 1].id : undefined
        const response: GetRoomListResponse = successCollectionResponse(
          roomList,
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
    "/pinned/:roomId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { roomId } = c.req.param()
        const { userId } = c.get("userProfile")

        const room = await prisma.room.findFirst({
          where: {
            ownerId: userId,
            OR: [
              { privateChat: { user1Id: roomId, user2Id: userId } },
              { privateChat: { user2Id: roomId, user1Id: userId } },
              { groupId: roomId },
              { channelId: roomId },
            ],
            deletedAt: null,
          },
        })

        if (!room) {
          return c.json(createError(ERROR.ROOM_NOT_FOUND), 404)
        }
        if (room.ownerId !== userId) {
          return c.json(createError(ERROR.NOT_ALLOWED), 403)
        }
        if (room.archivedAt) {
          return c.json(createError(ERROR.CANNOT_PINNED_ARCHIVED_ROOM), 409)
        }
        if (room.pinnedAt) {
          return c.json(createError(ERROR.ROOM_ALREADY_PINNED), 409)
        }

        await pinRoom(room.id)

        const response: PinRoomResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .delete(
    "/pinned/:roomId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { roomId } = c.req.param()
        const { userId } = c.get("userProfile")

        const room = await prisma.room.findFirst({
          where: {
            ownerId: userId,
            OR: [
              { privateChat: { user1Id: roomId, user2Id: userId } },
              { privateChat: { user2Id: roomId, user1Id: userId } },
              { groupId: roomId },
              { channelId: roomId },
            ],
            deletedAt: null,
          },
        })

        if (!room) {
          return c.json(createError(ERROR.ROOM_NOT_FOUND), 404)
        }
        if (room.ownerId !== userId) {
          return c.json(createError(ERROR.NOT_ALLOWED), 403)
        }
        if (!room.pinnedAt) {
          return c.json(createError(ERROR.ROOM_NOT_PINNED), 409)
        }

        await unpinRoom(room.id)

        const response: PinRoomResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get(
    "/archived",
    zValidator("query", collectionSchema),
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { limit, cursor } = c.req.valid("query")
        const { userId } = c.get("userProfile")

        const result = await prisma.room.findMany({
          where: {
            ownerId: userId,
            deletedAt: null,
            pinnedAt: null,
            archivedAt: { not: null },
          },
          include: { ...getRoomIncludeQuery({ userId }) },
          orderBy: [
            { lastMessageId: { sort: "desc", nulls: "first" } },
            { createdAt: "desc" },
          ],
          take: limit,
          cursor: cursor ? { id: cursor } : undefined,
          skip: cursor ? 1 : undefined,
        })

        const roomList: Room[] = result.map(mapRoomModelToRoom)

        const total = result.length
        const nextCursor =
          total > 0 && total === limit ? result[total - 1].id : undefined
        const response: GetRoomListResponse = successCollectionResponse(
          roomList,
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
    "/archived/:roomId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { roomId } = c.req.param()
        const { userId } = c.get("userProfile")

        const room = await prisma.room.findFirst({
          where: {
            ownerId: userId,
            OR: [
              { privateChat: { user1Id: roomId, user2Id: userId } },
              { privateChat: { user2Id: roomId, user1Id: userId } },
              { groupId: roomId },
              { channelId: roomId },
            ],
            deletedAt: null,
          },
        })

        if (!room) {
          return c.json(createError(ERROR.ROOM_NOT_FOUND), 404)
        }
        if (room.ownerId !== userId) {
          return c.json(createError(ERROR.NOT_ALLOWED), 403)
        }
        if (room.archivedAt) {
          return c.json(createError(ERROR.ROOM_ALREADY_ARCHIVED), 409)
        }

        await archiveRoom(room.id)

        const response: ArchiveRoomResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .delete(
    "/archived/:roomId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { roomId } = c.req.param()
        const { userId } = c.get("userProfile")

        const room = await prisma.room.findFirst({
          where: {
            ownerId: userId,
            OR: [
              { privateChat: { user1Id: roomId, user2Id: userId } },
              { privateChat: { user2Id: roomId, user1Id: userId } },
              { groupId: roomId },
              { channelId: roomId },
            ],
            deletedAt: null,
          },
        })

        if (!room) {
          return c.json(createError(ERROR.ROOM_NOT_FOUND), 404)
        }
        if (room.ownerId !== userId) {
          return c.json(createError(ERROR.NOT_ALLOWED), 403)
        }
        if (!room.archivedAt) {
          return c.json(createError(ERROR.ROOM_NOT_ARCHIVED), 409)
        }

        await unarchiveRoom(room.id)

        const response: UnarchiveRoomResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get("/:roomId", sessionMiddleware, validateProfileMiddleware, async (c) => {
    try {
      const { roomId } = c.req.param()
      const { userId } = c.get("userProfile")

      const groupId = roomId
      const channelId = roomId

      const room = await prisma.room.findFirst({
        where: {
          ownerId: userId,
          OR: [
            { privateChat: { user1Id: roomId, user2Id: userId } },
            { privateChat: { user2Id: roomId, user1Id: userId } },
            { groupId },
            { channelId },
          ],
          deletedAt: null,
        },
        include: {
          ...getRoomIncludeQuery({ userId }),
        },
      })

      if (!room) {
        return c.json(createError(ERROR.ROOM_NOT_FOUND), 404)
      }

      const response: GetRoomResponse = successResponse(
        mapRoomModelToRoom(room),
      )
      return c.json(response)
    } catch {
      return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
    }
  })
  .delete(
    "/:roomId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { roomId } = c.req.param()
        const { userId } = c.get("userProfile")

        const groupId = roomId
        const channelId = roomId

        const room = await prisma.room.findFirst({
          where: {
            ownerId: userId,
            OR: [
              { privateChat: { user1Id: roomId, user2Id: userId } },
              { privateChat: { user2Id: roomId, user1Id: userId } },
              { groupId },
              { channelId },
            ],
            deletedAt: null,
          },
        })

        if (!room) {
          return c.json(createError(ERROR.ROOM_NOT_FOUND), 404)
        }
        if (room.ownerId !== userId) {
          return c.json(createError(ERROR.NOT_ALLOWED), 403)
        }

        // * Can only delete room if already left group or unsubscribed channel
        if (room.type === "GROUP") {
          const member = await prisma.groupMember.findFirst({
            where: { userId, groupId, leftAt: null },
          })
          if (member) {
            return c.json(createError(ERROR.CANNOT_DELETE_JOINED_GROUP), 403)
          }
        } else if (room.type === "CHANNEL") {
          const subscriber = await prisma.channelSubscriber.findFirst({
            where: { userId, channelId, unsubscribedAt: null },
          })
          if (subscriber) {
            return c.json(
              createError(ERROR.CANNOT_DELETE_SUBSCRIBED_CHANNEL),
              403,
            )
          }
        }

        await deleteRoom({
          id: room.id,
          type: room.type,
          ownerId: userId,
          privateChatId: room.privateChatId!,
          groupId,
          channelId,
        })

        const response: DeleteRoomResponse = successResponse({ id: room.id })
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )

export default roomApp
