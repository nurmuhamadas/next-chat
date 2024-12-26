import "server-only"

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
  addGroupAdmin,
  clearAllChat,
  joinGroup,
  leaveGroup,
  removeGroupAdmin,
} from "../lib/group-member-queries"
import {
  createGroupOption,
  updateGroupOption,
} from "../lib/group-option-queries"
import {
  createGroup,
  createGroupInviteCode,
  softDeleteGroup,
  updateGroup,
  validateGroupMember,
} from "../lib/group-queries"
import {
  getGroupWhere,
  mapGroupMemberModelToGroupMember,
  mapGroupModelToGroup,
  mapGroupModelToGroupSearch,
  mapGroupOptionModelToOption,
} from "../lib/utils"
import {
  groupSchema,
  joinGroupSchema,
  updateGroupOptionSchema,
} from "../schema"

const groupApp = new Hono()
  .get(
    "/",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("query", searchQuerySchema, zodErrorHandler),
    async (c) => {
      try {
        const { query, limit, cursor } = c.req.valid("query")
        const { userId } = c.get("userProfile")

        const result = await prisma.group.findMany({
          where: {
            members: { some: { userId, leftAt: null } },
            name: { contains: query, mode: "insensitive" },
            deletedAt: null,
          },
          include: {
            _count: {
              select: { members: { where: { leftAt: null } } },
            },
          },
          take: limit,
          cursor: cursor ? { id: cursor } : undefined,
          skip: cursor ? 1 : undefined,
        })

        const mappedGroup: Group[] = result.map(mapGroupModelToGroup)

        const total = result.length
        const nextCursor =
          total > 0 && total === limit ? result[total - 1].id : undefined
        const response: GetGroupsResponse = successCollectionResponse(
          mappedGroup,
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
    zValidator("form", groupSchema, zodErrorHandler),
    async (c) => {
      try {
        const {
          name,
          image,
          type,
          memberIds: memberIdsStr,
          description,
        } = c.req.valid("form")
        const memberIds = !!memberIdsStr ? memberIdsStr.split(",") : []
        console.log(memberIds, typeof memberIdsStr)

        const imageFile = image as unknown as File

        const { userId } = c.get("userProfile")

        const existingGroups = await prisma.group.findFirst({
          where: { ownerId: userId, name, deletedAt: null },
        })
        if (existingGroups) {
          return c.json(createError(ERROR.GROUP_NAME_DUPLICATED, ["name"]), 409)
        }

        const invalid = await validateGroupMember(userId, memberIds)
        if (invalid) {
          return c.json(createError(invalid.error, invalid.path), invalid.code)
        }

        let imageUrl: string | undefined
        let fileId: string | undefined
        if (imageFile) {
          const file = await uploadFile({ file: imageFile })
          fileId = file.$id
          imageUrl = constructFileUrl(file.$id)
        }

        try {
          const inviteCode = await createGroupInviteCode()

          const createdGroup = await createGroup({
            name,
            description,
            type,
            imageUrl,
            ownerId: userId,
            inviteCode,
            memberIds,
          })

          const groupResult = mapGroupModelToGroup({
            ...createdGroup,
            _count: { members: memberIds.length + 1 },
          })
          const response: CreateGroupResponse = successResponse(groupResult)
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
    "/name-availability/:groupName",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { groupName } = c.req.param()
        const { userId } = c.get("userProfile")

        const existingGroups = await prisma.group.findFirst({
          where: { ownerId: userId, name: groupName, deletedAt: null },
        })

        return c.json(successResponse(!existingGroups))
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

        const result = await prisma.group.findMany({
          where: {
            type: "PUBLIC",
            members: { none: { userId, leftAt: null } },
            name: { contains: query, mode: "insensitive" },
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            imageUrl: true,
            _count: {
              select: { members: { where: { leftAt: null } } },
            },
          },
          take: limit,
          cursor: cursor ? { id: cursor } : undefined,
          skip: cursor ? 1 : undefined,
        })

        const total = result.length
        const nextCursor =
          total > 0 && total === limit ? result[total - 1].id : undefined
        const response: SearchGroupsResponse = successCollectionResponse(
          result.map(mapGroupModelToGroupSearch),
          total,
          nextCursor,
        )
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get("/:groupId", sessionMiddleware, validateProfileMiddleware, async (c) => {
    try {
      const { groupId } = c.req.param()

      const { userId } = c.get("userProfile")

      const group = await prisma.group.findUnique({
        where: { ...getGroupWhere(groupId, userId), deletedAt: undefined },
        include: {
          _count: {
            select: { members: { where: { leftAt: null } } },
          },
        },
      })
      if (!group) {
        return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
      }

      const mappedGroup: Group = mapGroupModelToGroup(group)

      if (group.deletedAt) {
        const response: GetGroupResponse = successResponse({
          ...mappedGroup,
          name: "Deleted Group",
          imageUrl: null,
          description: null,
          totalMembers: 0,
        })
        return c.json(response)
      }

      const response: GetGroupResponse = successResponse(mappedGroup)
      return c.json(response)
    } catch {
      return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
    }
  })
  .patch(
    "/:groupId",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("form", groupSchema.partial(), zodErrorHandler),
    async (c) => {
      try {
        const { groupId } = c.req.param()
        const { userId } = c.get("userProfile")

        const { name, image, type, description } = c.req.valid("form")
        const imageFile = image as unknown as File

        const group = await prisma.group.findUnique({
          where: { ...getGroupWhere(groupId, userId) },
          include: {
            _count: {
              select: {
                members: { where: { userId, isAdmin: true, leftAt: null } },
              },
            },
          },
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const isAdmin = group._count.members > 0
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
          const updatedGroup = await updateGroup(groupId, {
            name,
            description,
            type,
            imageUrl,
          })

          const groupResult = mapGroupModelToGroup(updatedGroup)

          // DELETE OLD IMAGE IF NEW IMAGE UPLOADED
          if (fileId && group.imageUrl) {
            const oldFileId = destructFileId(group.imageUrl)
            await deleteFile({ id: oldFileId })
          }

          const response: PatchGroupResponse = successResponse(groupResult)
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
    "/:groupId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { groupId } = c.req.param()
        const { userId } = c.get("userProfile")

        const group = await prisma.group.findUnique({
          where: { ...getGroupWhere(groupId, userId) },
          include: {
            _count: {
              select: {
                members: { where: { userId, isAdmin: true, leftAt: null } },
              },
            },
          },
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const isAdmin = group._count.members > 0
        if (!isAdmin) {
          return c.json(createError(ERROR.NOT_ALLOWED), 403)
        }

        await softDeleteGroup(groupId)

        const response: DeleteGroupResponse = successResponse({ id: groupId })
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get(
    "/:groupId/is-admin",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { groupId } = c.req.param()

        const { userId } = c.get("userProfile")

        const group = await prisma.group.findUnique({
          where: { ...getGroupWhere(groupId, userId) },
          include: {
            _count: {
              select: {
                members: { where: { userId, isAdmin: true, leftAt: null } },
              },
            },
          },
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const isAdmin = group._count.members > 0

        const response = successResponse<boolean>(isAdmin)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get(
    "/:groupId/is-member",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { groupId } = c.req.param()

        const { userId } = c.get("userProfile")

        const group = await prisma.group.findUnique({
          where: { ...getGroupWhere(groupId, userId) },
          include: {
            _count: {
              select: {
                members: { where: { userId, leftAt: null } },
              },
            },
          },
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const isMember = group._count.members > 0

        const response = successResponse<boolean>(isMember)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get(
    "/:groupId/members",
    zValidator("query", collectionSchema, zodErrorHandler),
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { groupId } = c.req.param()
        const { limit, cursor } = c.req.valid("query")

        const { userId } = c.get("userProfile")

        const group = await prisma.group.findUnique({
          where: { ...getGroupWhere(groupId, userId) },
          select: {
            members: {
              where: { leftAt: null },
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
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const total = group.members.length
        const nextCursor =
          total > 0 && total === limit ? group.members[total - 1].id : undefined
        const response: GetGroupMembersResponse = successCollectionResponse(
          group.members.map(mapGroupMemberModelToGroupMember),
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
    "/:groupId/members/:userId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { groupId, userId: addedUserId } = c.req.param()

        const { userId } = c.get("userProfile")

        const group = await prisma.group.findUnique({
          where: { ...getGroupWhere(groupId, userId) },
          include: {
            members: {
              where: {
                userId: { in: [userId, addedUserId] },
                leftAt: null,
              },
            },
          },
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const isAdmin = group.members.find((v) => v.userId === userId)?.isAdmin
        if (!isAdmin) {
          return c.json(createError(ERROR.ONLY_ADMIN_ADD_MEMBER), 403)
        }

        const member = group.members.find((v) => v.userId === addedUserId)
        if (member) {
          return c.json(createError(ERROR.ADDED_USER_ALREADY_MEMBER), 409)
        }

        const addedUser = await prisma.user.findUnique({
          where: {
            id: addedUserId,
            profile: { isNot: null },
            blockedUsers: {
              none: {
                blockedUserId: userId,
                unblockedAt: null,
              },
            },
          },
          include: {
            blockingUsers: {
              where: { userId, unblockedAt: null },
            },
          },
        })
        if (!addedUser) {
          return c.json(createError(ERROR.ADDED_USER_NOT_FOUND), 404)
        }

        const isBlockingAddedUser = addedUser.blockingUsers.length > 0
        if (isBlockingAddedUser) {
          return c.json(createError(ERROR.ADD_BLOCKED_USERS_NOT_ALLOWED), 403)
        }

        await joinGroup({
          userId: addedUserId,
          groupId,
        })

        const response: AddGroupMemberResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .delete(
    "/:groupId/members/:userId",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { groupId, userId: removedUserId } = c.req.param()

        const { userId } = c.get("userProfile")

        const group = await prisma.group.findUnique({
          where: { ...getGroupWhere(groupId, userId) },
          include: {
            members: {
              where: {
                userId: { in: [userId, removedUserId] },
                leftAt: null,
              },
            },
          },
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const isAdmin = group.members.find((v) => v.userId === userId)?.isAdmin
        if (!isAdmin) {
          return c.json(createError(ERROR.ONLY_ADMIN_REMOVE_MEMBER), 403)
        }

        const member = group.members.find((v) => v.userId === removedUserId)
        if (!member) {
          return c.json(createError(ERROR.REMOVED_USER_IS_NOT_MEMBER), 400)
        }

        await leaveGroup({
          memberId: member.id,
          userId: removedUserId,
          groupId,
        })

        const response: DeleteGroupMemberResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post(
    "/:groupId/members/:userId/admin",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { groupId, userId: addedAdminId } = c.req.param()

        const { userId } = c.get("userProfile")

        const group = await prisma.group.findUnique({
          where: { ...getGroupWhere(groupId, userId) },
          include: {
            members: {
              where: {
                userId: { in: [userId, addedAdminId] },
                leftAt: null,
              },
            },
          },
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const isAdmin = group.members.find((v) => v.userId === userId)?.isAdmin
        if (!isAdmin) {
          return c.json(createError(ERROR.ONLY_ADMIN_CAN_ADD_ADMIN), 403)
        }

        const member = group.members.find((v) => v.userId === addedAdminId)
        if (!member) {
          return c.json(createError(ERROR.USER_IS_NOT_MEMBER), 400)
        }

        const isAlreadyAdmin = member.isAdmin
        if (isAlreadyAdmin) {
          return c.json(createError(ERROR.USER_ALREADY_ADMIN), 400)
        }

        await addGroupAdmin({ memberId: member.id })

        const response: SetAdminGroupResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .delete(
    "/:groupId/members/:userId/admin",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { groupId, userId: removedAdminId } = c.req.param()

        const { userId } = c.get("userProfile")

        const group = await prisma.group.findUnique({
          where: { ...getGroupWhere(groupId, userId) },
          include: {
            members: {
              where: {
                userId: { in: [userId, removedAdminId] },
                leftAt: null,
              },
            },
          },
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const isAdmin = group.members.find((v) => v.userId === userId)?.isAdmin
        if (!isAdmin) {
          return c.json(createError(ERROR.ONLY_ADMIN_CAN_ADD_ADMIN), 403)
        }

        const member = group.members.find((v) => v.userId === removedAdminId)
        if (!member) {
          return c.json(createError(ERROR.USER_IS_NOT_MEMBER), 400)
        }

        const isAlreadyAdmin = member.isAdmin
        if (!isAlreadyAdmin) {
          return c.json(createError(ERROR.USER_IS_NOT_ADMIN), 400)
        }

        await removeGroupAdmin({ memberId: member.id })

        const response: UnsetAdminGroupResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post(
    "/:groupId/join",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("json", joinGroupSchema, zodErrorHandler),
    async (c) => {
      try {
        const { code } = c.req.valid("json")
        const { groupId } = c.req.param()

        const { userId } = c.get("userProfile")

        const group = await prisma.group.findUnique({
          where: { id: groupId, deletedAt: null },
          include: {
            members: { where: { userId, leftAt: null } },
          },
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const member = group.members.find((v) => v.userId === userId)
        if (member) {
          return c.json(createError(ERROR.ALREADY_MEMBER), 403)
        }

        if (group.type === "PRIVATE" && group.inviteCode !== code) {
          return c.json(createError(ERROR.INVALID_JOIN_CODE), 400)
        }

        await joinGroup({ userId, groupId })

        const response: JoinGroupResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .post(
    "/:groupId/left",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { groupId } = c.req.param()
        const { userId } = c.get("userProfile")

        const group = await prisma.group.findUnique({
          where: { ...getGroupWhere(groupId, userId) },
          include: {
            members: {
              where: {
                OR: [{ userId }, { isAdmin: true }],
                leftAt: null,
              },
            },
            _count: { select: { members: { where: { leftAt: null } } } },
          },
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const member = group.members.find((v) => v.userId === userId)
        if (!member) {
          return c.json(createError(ERROR.NOT_GROUP_MEMBER), 403)
        }

        if (group._count.members === 1) {
          await softDeleteGroup(groupId)
          const response: LeaveGroupResponse = successResponse(true)
          return c.json(response)
        }

        const isOnlyOneAdmin = member.isAdmin && group.members.length === 1
        if (isOnlyOneAdmin) {
          const otherMember = await prisma.groupMember.findFirst({
            where: { userId: { not: userId }, groupId, leftAt: null },
          })

          if (otherMember) {
            await addGroupAdmin({ memberId: otherMember.id })
          }
        }

        await leaveGroup({ memberId: member.id, groupId, userId })

        const response: LeaveGroupResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .delete(
    "/:groupId/chat",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { groupId } = c.req.param()

        const { userId } = c.get("userProfile")

        const group = await prisma.group.findUnique({
          where: { ...getGroupWhere(groupId, userId) },
          include: {
            members: { where: { userId, leftAt: null } },
          },
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const member = group.members.find((v) => v.userId === userId)
        if (!member) {
          return c.json(createError(ERROR.NOT_GROUP_MEMBER), 403)
        }

        await clearAllChat({ userId, groupId, isAdmin: member.isAdmin })

        const response: DeleteAllGroupChatResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .get(
    "/:groupId/options",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { groupId } = c.req.param()

        const { userId } = c.get("userProfile")

        const group = await prisma.group.findUnique({
          where: { ...getGroupWhere(groupId, userId) },
          include: {
            members: { where: { userId, leftAt: null } },
            membersOption: { where: { userId } },
          },
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const member = group.members.find((v) => v.userId === userId)
        if (!member) {
          return c.json(createError(ERROR.NOT_GROUP_MEMBER), 403)
        }

        const groupOption = group.membersOption[0]
        if (!groupOption) {
          const option = await createGroupOption({ userId, groupId })
          const response: GetGroupOptionResponse = successResponse(
            mapGroupOptionModelToOption(option),
          )
          return c.json(response)
        }

        const response: GetGroupOptionResponse = successResponse(
          mapGroupOptionModelToOption(groupOption),
        )
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .patch(
    "/:groupId/options",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("json", updateGroupOptionSchema),
    async (c) => {
      try {
        const { groupId } = c.req.param()
        const { notification } = c.req.valid("json")

        const { userId } = c.get("userProfile")

        const group = await prisma.group.findUnique({
          where: { ...getGroupWhere(groupId, userId) },
          include: {
            members: { where: { userId, leftAt: null } },
            membersOption: { where: { userId } },
          },
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const member = group.members.find((v) => v.userId === userId)
        if (!member) {
          return c.json(createError(ERROR.NOT_GROUP_MEMBER), 403)
        }

        const groupOption = group.membersOption[0]
        if (!groupOption) {
          const option = await createGroupOption({
            userId,
            groupId,
            notification,
          })
          const response: GetGroupOptionResponse = successResponse(
            mapGroupOptionModelToOption(option),
          )
          return c.json(response)
        }

        const result = await updateGroupOption(groupOption.id, {
          notification,
        })

        const response: UpdateGroupNotifResponse = successResponse(
          mapGroupOptionModelToOption(result),
        )
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )

export default groupApp
