import "server-only"

import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { searchQuerySchema } from "@/constants"
import { ERROR } from "@/constants/error"
import { getBlockedUser } from "@/features/blocked-users/lib/queries"
import { getLastMessageByGroupIds } from "@/features/messages/lib/queries"
import { getUserProfileById } from "@/features/user/lib/queries"
import { constructFileUrl } from "@/lib/appwrite"
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
  createGroupMember,
  deleteAllGroupMembers,
  getCurrentGroupMember,
  getGroupMembers,
  leaveGroup,
  setUserAsAdmin,
  unsetUserAdmin,
  validateGroupAdmin,
  validateGroupMember,
} from "../lib/group-member-queries"
import {
  createGroupOption,
  deleteGroupOption,
  getGroupOption,
  updateGroupOption,
} from "../lib/group-option-queries"
import {
  createGroup,
  createGroupInviteCode,
  getGroupById,
  getGroupOwnersByUserIds,
  getGroupsByUserId,
  searchGroup,
  validateGroupData,
  validateJoinCode,
} from "../lib/group-queries"
import {
  mapGroupModelToGroup,
  mapGroupOptModelToGroupOpt,
  mapUserModelToGroupOwner,
} from "../lib/utils"
import {
  groupSchema,
  joinGroupSchema,
  updateGroupOptionSchema,
} from "../schema"

const groupApp = new Hono()
  .get("/", sessionMiddleware, validateProfileMiddleware, async (c) => {
    try {
      const databases = c.get("databases")
      const currentProfile = c.get("userProfile")

      const result = await getGroupsByUserId(databases, {
        userId: currentProfile.$id,
      })

      const ownerIds = result.documents.map((v) => v.ownerId)
      const { data: owners } = await getGroupOwnersByUserIds(databases, {
        userIds: ownerIds,
      })

      const lastMessages = await getLastMessageByGroupIds(databases, {
        groupIds: result.documents.map((v) => v.$id),
      })
      const mappedGroup: Group[] = result.documents.map((group) =>
        mapGroupModelToGroup(
          group,
          owners.find((user) => user.id === group.ownerId)!,
          lastMessages[group.$id],
        ),
      )

      const response: GetGroupsResponse = successCollectionResponse(
        mappedGroup,
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
        const memberIds = memberIdsStr ? memberIdsStr.split(",") : []

        const imageFile = image as unknown as File

        const databases = c.get("databases")
        const storage = c.get("storage")
        const currentProfile = c.get("userProfile")

        const invalid = await validateGroupData(databases, currentProfile.$id, {
          memberIds,
        })
        if (invalid) {
          return c.json(createError(invalid.error, invalid.path), invalid.code)
        }

        let imageUrl: string | undefined
        let fileId: string | undefined
        if (imageFile) {
          const file = await uploadFile(storage, { file: imageFile })
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
            userId: currentProfile.$id,
            notification: true,
          })
          await createGroupMember(databases, {
            userId: currentProfile.$id,
            groupId: createdGroup.$id,
            isAdmin: true,
          })

          await Promise.all([
            ...memberIds.map((memberId) =>
              createGroupMember(databases, {
                userId: memberId,
                groupId: createdGroup.$id,
                isAdmin: false,
              }),
            ),
          ])
          await Promise.all([
            ...memberIds.map((memberId) =>
              createGroupOption(databases, {
                groupId: createdGroup.$id,
                userId: memberId,
                notification: true,
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
            await deleteFile(storage, { id: fileId })
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
        const currentProfile = c.get("userProfile")

        const result = await searchGroup(databases, currentProfile.$id, {
          query,
          limit,
          offset,
        })

        const response: SearchGroupsResponse = successCollectionResponse(
          result.data,
          result.total,
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

      const databases = c.get("databases")
      const profile = c.get("userProfile")

      const group = await getGroupById(databases, {
        id: groupId,
      })
      if (!group) {
        return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
      }

      const isMember = await validateGroupMember(databases, {
        userId: profile.$id,
        groupId,
      })
      if (group.type === "PRIVATE" && !isMember) {
        return c.json(createError(ERROR.NOT_ALLOWED), 403)
      }

      const owner = await getUserProfileById(databases, {
        userId: group.ownerId,
      })
      if (!owner) {
        return c.json(createError(ERROR.GROUP_OWNER_NOT_FOUND), 404)
      }

      const mappedGroup: Group = mapGroupModelToGroup(
        group,
        mapUserModelToGroupOwner(owner),
      )

      const response: GetGroupResponse = successResponse(mappedGroup)
      return c.json(response)
    } catch {
      return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
    }
  })
  .get(
    "/:groupId/members",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { groupId } = c.req.param()

        const databases = c.get("databases")
        const profile = c.get("userProfile")

        const group = await getGroupById(databases, {
          id: groupId,
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const isMember = await validateGroupMember(databases, {
          userId: profile.$id,
          groupId,
        })
        if (group.type === "PRIVATE" && !isMember) {
          return c.json(createError(ERROR.NOT_ALLOWED), 403)
        }

        const result = await getGroupMembers(databases, { groupId })

        const response: GetGroupMembersResponse = successCollectionResponse(
          result.data,
          result.total,
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
        const { groupId, userId } = c.req.param()

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const group = await getGroupById(databases, {
          id: groupId,
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const addedUser = await getUserProfileById(databases, { userId })
        if (!addedUser) {
          return c.json(createError(ERROR.ADDED_USER_NOT_FOUND), 404)
        }

        const isAdmin = await validateGroupAdmin(databases, {
          userId: currentProfile.$id,
          groupId,
        })
        if (!isAdmin) {
          return c.json(createError(ERROR.ONLY_ADMIN_ADD_MEMBER), 403)
        }

        const isAlreadyMember = await validateGroupMember(databases, {
          userId,
          groupId,
        })
        if (isAlreadyMember) {
          return c.json(createError(ERROR.ADDED_USER_ALREADY_MEMBER), 400)
        }

        const blockedUsers = await getBlockedUser(databases, {
          userId: currentProfile.$id,
          blockedUserId: userId,
        })
        if (!!blockedUsers) {
          return c.json(createError(ERROR.ADD_BLOCKED_USERS_NOT_ALLOWED), 403)
        }

        const userBlocked = await getBlockedUser(databases, {
          userId,
          blockedUserId: currentProfile.$id,
        })
        if (!!userBlocked) {
          return c.json(
            createError(ERROR.ADDDED_BY_BLOCKED_USER_NOT_ALLOWED),
            403,
          )
        }

        await createGroupMember(databases, {
          userId,
          groupId,
          isAdmin: false,
        })
        await createGroupOption(databases, {
          userId,
          groupId,
          notification: true,
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
        const { groupId, userId } = c.req.param()

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const group = await getGroupById(databases, {
          id: groupId,
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const removedUser = await getUserProfileById(databases, { userId })
        if (!removedUser) {
          return c.json(createError(ERROR.REMOVED_USER_NOT_FOUND), 404)
        }

        const isAdmin = await validateGroupAdmin(databases, {
          userId: currentProfile.$id,
          groupId,
        })
        if (!isAdmin) {
          return c.json(createError(ERROR.ONLY_ADMIN_REMOVE_MEMBER), 403)
        }

        const isAlreadyMember = await validateGroupMember(databases, {
          userId,
          groupId,
        })
        if (!isAlreadyMember) {
          return c.json(createError(ERROR.REMOVED_USER_IS_NOT_MEMBER), 400)
        }

        await leaveGroup(databases, { userId, groupId })
        await deleteGroupOption(databases, {
          userId,
          groupId,
        })

        const response: KickGroupMemberResponse = successResponse(true)
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
        const { groupId, userId } = c.req.param()

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const group = await getGroupById(databases, {
          id: groupId,
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const isAdmin = await validateGroupAdmin(databases, {
          userId: currentProfile.$id,
          groupId,
        })
        if (!isAdmin) {
          return c.json(createError(ERROR.ONLY_ADMIN_ADD_MEMBER), 403)
        }

        const isMember = await validateGroupMember(databases, {
          userId,
          groupId,
        })
        if (!isMember) {
          return c.json(createError(ERROR.USER_IS_NOT_MEMBER), 403)
        }

        const isAlreadyAdmin = await validateGroupAdmin(databases, {
          userId,
          groupId,
        })
        if (isAlreadyAdmin) {
          return c.json(createError(ERROR.USER_ALREADY_ADMIN), 400)
        }

        await setUserAsAdmin(databases, { userId, groupId })

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
        const { groupId, userId } = c.req.param()

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const group = await getGroupById(databases, {
          id: groupId,
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const isAdmin = await validateGroupAdmin(databases, {
          userId: currentProfile.$id,
          groupId,
        })
        if (!isAdmin) {
          return c.json(createError(ERROR.ONLY_ADMIN_REMOVE_MEMBER), 403)
        }

        const isMember = await validateGroupMember(databases, {
          userId,
          groupId,
        })
        if (!isMember) {
          return c.json(createError(ERROR.USER_IS_NOT_MEMBER), 403)
        }

        const isAlreadyAdmin = await validateGroupAdmin(databases, {
          userId,
          groupId,
        })
        if (!isAlreadyAdmin) {
          return c.json(createError(ERROR.USER_IS_NOT_ADMIN), 400)
        }

        await unsetUserAdmin(databases, { userId, groupId })

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

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const group = await getGroupById(databases, {
          id: groupId,
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const isMember = await validateGroupMember(databases, {
          userId: currentProfile.$id,
          groupId,
        })
        if (isMember) {
          return c.json(createError(ERROR.ALREADY_MEMBER), 403)
        }

        const isJoinCodeValid = await validateJoinCode(databases, {
          groupId,
          code,
        })
        if (!isJoinCodeValid) {
          return c.json(createError(ERROR.INVALID_JOIN_CODE), 400)
        }

        await createGroupMember(databases, {
          groupId,
          userId: currentProfile.$id,
          isAdmin: false,
        })
        await createGroupOption(databases, {
          groupId,
          userId: currentProfile.$id,
          notification: true,
        })

        const response: JoinGroupResponse = successResponse(true)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )
  .delete(
    "/:groupId/left",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      try {
        const { groupId } = c.req.param()

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const group = await getGroupById(databases, {
          id: groupId,
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const isMember = await validateGroupMember(databases, {
          userId: currentProfile.$id,
          groupId,
        })
        if (!isMember) {
          return c.json(createError(ERROR.NOT_GROUP_MEMBER), 403)
        }

        const isAdmin = await validateGroupAdmin(databases, {
          userId: currentProfile.$id,
          groupId,
        })
        if (isAdmin) {
          const members = await getGroupMembers(databases, { groupId })
          const admins = members.data.filter((v) => v.isAdmin)
          if (admins.length === 1 && members.total > 1) {
            const membersWithoutUser = members.data.filter(
              (v) => v.id !== currentProfile.$id,
            )

            await setUserAsAdmin(databases, {
              userId: membersWithoutUser[0].id,
              groupId,
            })
          }
        }

        await leaveGroup(databases, {
          groupId: group.$id,
          userId: currentProfile.$id,
        })
        await deleteGroupOption(databases, {
          groupId,
          userId: currentProfile.$id,
        })

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

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const group = await getGroupById(databases, {
          id: groupId,
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const currentMember = await getCurrentGroupMember(databases, {
          groupId,
          userId: currentProfile.$id,
        })
        if (!currentMember) {
          return c.json(createError(ERROR.NOT_GROUP_MEMBER), 403)
        }

        await leaveGroup(databases, { groupId, userId: currentProfile.$id })

        await deleteAllGroupMembers(databases, { userId: currentProfile.$id })

        await createGroupMember(databases, {
          groupId,
          userId: currentProfile.$id,
          isAdmin: currentMember.isAdmin,
        })

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

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const group = await getGroupById(databases, {
          id: groupId,
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const currentMember = await getCurrentGroupMember(databases, {
          groupId,
          userId: currentProfile.$id,
        })
        if (!currentMember) {
          return c.json(createError(ERROR.NOT_GROUP_MEMBER), 403)
        }

        const groupOption = await getGroupOption(databases, {
          groupId: group.$id,
          userId: currentProfile.$id,
        })
        if (!groupOption) {
          return c.json(createError(ERROR.NOT_GROUP_MEMBER), 404)
        }

        const response: GetGroupOptionResponse = successResponse(
          mapGroupOptModelToGroupOpt(groupOption),
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

        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const group = await getGroupById(databases, {
          id: groupId,
        })
        if (!group) {
          return c.json(createError(ERROR.GROUP_NOT_FOUND), 404)
        }

        const currentMember = await getCurrentGroupMember(databases, {
          groupId,
          userId: currentProfile.$id,
        })
        if (!currentMember) {
          return c.json(createError(ERROR.NOT_GROUP_MEMBER), 403)
        }

        const groupOption = await getGroupOption(databases, {
          groupId: group.$id,
          userId: currentProfile.$id,
        })
        if (!groupOption) {
          return c.json(createError(ERROR.NOT_GROUP_MEMBER), 404)
        }

        const result = await updateGroupOption(databases, groupOption.$id, {
          notification,
        })

        const response: UpdateGroupNotifResponse = successResponse(
          mapGroupOptModelToGroupOpt(result),
        )
        return c.json(response)
      } catch (e) {
        console.log(e)
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )

export default groupApp
