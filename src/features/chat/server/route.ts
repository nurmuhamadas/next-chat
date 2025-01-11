import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { collectionSchema, searchQuerySchema } from "@/constants"
import { ERROR } from "@/constants/error"
import AuthorizationError from "@/lib/exceptions/authorization-error"
import InvariantError from "@/lib/exceptions/invariant-error"
import NotFoundError from "@/lib/exceptions/not-found-error"
import { prisma } from "@/lib/prisma"
import { sessionMiddleware } from "@/lib/session-middleware"
import { successCollectionResponse, successResponse } from "@/lib/utils"
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
    },
  )
  .get(
    "/search-private",
    zValidator("query", searchQuerySchema),
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
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
      const response: GetPrivateRoomsResponse = successCollectionResponse(
        userSearch,
        total,
        nextCursor,
      )
      return c.json(response)
    },
  )
  .get(
    "/pinned",
    zValidator("query", collectionSchema),
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
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
    },
  )
  .post(
    "/pinned/:roomId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
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
        throw new NotFoundError(ERROR.ROOM_NOT_FOUND)
      }
      if (room.ownerId !== userId) {
        throw new AuthorizationError(ERROR.NOT_ALLOWED)
      }
      if (room.archivedAt) {
        throw new InvariantError(ERROR.CANNOT_PINNED_ARCHIVED_ROOM)
      }
      if (room.pinnedAt) {
        throw new InvariantError(ERROR.ROOM_ALREADY_PINNED)
      }

      await pinRoom(room.id)

      const response: PinRoomResponse = successResponse(true)
      return c.json(response)
    },
  )
  .delete(
    "/pinned/:roomId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
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
        throw new NotFoundError(ERROR.ROOM_NOT_FOUND)
      }
      if (room.ownerId !== userId) {
        throw new AuthorizationError(ERROR.NOT_ALLOWED)
      }
      if (!room.pinnedAt) {
        throw new InvariantError(ERROR.ROOM_NOT_PINNED)
      }

      await unpinRoom(room.id)

      const response: PinRoomResponse = successResponse(true)
      return c.json(response)
    },
  )
  .get(
    "/archived",
    zValidator("query", collectionSchema),
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
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
    },
  )
  .post(
    "/archived/:roomId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
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
        throw new NotFoundError(ERROR.ROOM_NOT_FOUND)
      }
      if (room.ownerId !== userId) {
        throw new AuthorizationError(ERROR.NOT_ALLOWED)
      }
      if (room.archivedAt) {
        throw new InvariantError(ERROR.ROOM_ALREADY_ARCHIVED)
      }

      await archiveRoom(room.id)

      const response: ArchiveRoomResponse = successResponse(true)
      return c.json(response)
    },
  )
  .delete(
    "/archived/:roomId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
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
        throw new NotFoundError(ERROR.ROOM_NOT_FOUND)
      }
      if (room.ownerId !== userId) {
        throw new AuthorizationError(ERROR.NOT_ALLOWED)
      }
      if (!room.archivedAt) {
        throw new InvariantError(ERROR.ROOM_NOT_ARCHIVED)
      }

      await unarchiveRoom(room.id)

      const response: UnarchiveRoomResponse = successResponse(true)
      return c.json(response)
    },
  )
  .get("/:roomId", sessionMiddleware, validateProfileMiddleware, async (c) => {
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
      throw new NotFoundError(ERROR.ROOM_NOT_FOUND)
    }

    const response: GetRoomResponse = successResponse(mapRoomModelToRoom(room))
    return c.json(response)
  })
  .delete(
    "/:roomId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
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
        throw new NotFoundError(ERROR.ROOM_NOT_FOUND)
      }
      if (room.ownerId !== userId) {
        throw new AuthorizationError(ERROR.NOT_ALLOWED)
      }

      // * Can only delete room if already left group or unsubscribed channel
      if (room.type === "GROUP") {
        const member = await prisma.groupMember.findFirst({
          where: { userId, groupId, leftAt: null },
        })
        if (member) {
          throw new AuthorizationError(ERROR.CANNOT_DELETE_JOINED_GROUP)
        }
      } else if (room.type === "CHANNEL") {
        const subscriber = await prisma.channelSubscriber.findFirst({
          where: { userId, channelId, unsubscribedAt: null },
        })
        if (subscriber) {
          throw new AuthorizationError(ERROR.CANNOT_DELETE_SUBSCRIBED_CHANNEL)
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
    },
  )

export default roomApp
