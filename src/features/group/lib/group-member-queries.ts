import "server-only"

import { Databases, ID, Query } from "node-appwrite"

import { getUsers } from "@/features/user/lib/queries"
import { APPWRITE_GROUP_MEMBERS_ID, DATABASE_ID } from "@/lib/appwrite/config"

import { mapGroupMemberModelToGroupMember } from "./utils"

export const createGroupMember = async (
  databases: Databases,
  data: Omit<GroupMemberModel, "leftAt" | "joinedAt">,
) => {
  return await databases.createDocument<GroupMemberAWModel>(
    DATABASE_ID,
    APPWRITE_GROUP_MEMBERS_ID,
    ID.unique(),
    {
      ...data,
      joinedAt: new Date(),
    },
  )
}

export const getGroupMembersByUserId = async (
  databases: Databases,
  { userId }: { userId: string },
): Promise<QueryResults<GroupMemberAWModel>> => {
  try {
    const result = await databases.listDocuments<GroupMemberAWModel>(
      DATABASE_ID,
      APPWRITE_GROUP_MEMBERS_ID,
      [Query.equal("userId", userId), Query.isNull("leftAt")],
    )

    return {
      total: result.total,
      data: result.documents,
    }
  } catch {
    return {
      total: 0,
      data: [],
    }
  }
}

export const validateGroupMember = async (
  databases: Databases,
  { userId, groupId }: { userId: string; groupId: string },
) => {
  const result = await databases.listDocuments<GroupMemberAWModel>(
    DATABASE_ID,
    APPWRITE_GROUP_MEMBERS_ID,
    [
      Query.equal("userId", userId),
      Query.equal("groupId", groupId),
      Query.isNull("leftAt"),
    ],
  )

  return result.total > 0
}

export const getGroupMembers = async (
  databases: Databases,
  { groupId }: { groupId: string },
): Promise<QueryResults<GroupMember>> => {
  try {
    const result = await databases.listDocuments<GroupMemberAWModel>(
      DATABASE_ID,
      APPWRITE_GROUP_MEMBERS_ID,
      [Query.equal("groupId", groupId), Query.isNull("leftAt")],
    )
    const memberIds = result.documents.map((v) => v.userId)

    const memberProfiles = await getUsers(databases, {
      queries: [
        Query.contains("$id", memberIds),
        Query.select([
          "$id",
          "firstName",
          "lastName",
          "imageUrl",
          "lastSeenAt",
        ]),
      ],
    })
    const memberProfileIds = memberProfiles.documents.map((v) => v.$id)

    const members = result.documents
      .filter((member) => memberProfileIds.includes(member.userId))
      .map((member) => {
        const profile = memberProfiles.documents.find(
          (v) => v.$id === member.userId,
        )
        return mapGroupMemberModelToGroupMember(member, profile!)
      })

    return {
      total: members.length,
      data: members,
    }
  } catch {
    return {
      total: 0,
      data: [],
    }
  }
}

export const leaveGroup = async (
  databases: Databases,
  { groupId, userId }: { groupId: string; userId: string },
) => {
  const result = await databases.listDocuments(
    DATABASE_ID,
    APPWRITE_GROUP_MEMBERS_ID,
    [
      Query.equal("groupId", groupId),
      Query.equal("userId", userId),
      Query.isNull("leftAt"),
    ],
  )

  return await databases.updateDocument<GroupMemberAWModel>(
    DATABASE_ID,
    APPWRITE_GROUP_MEMBERS_ID,
    result.documents[0]?.$id,
    {
      isAdmin: false,
      leftAt: new Date(),
    },
  )
}

export const validateGroupAdmin = async (
  databases: Databases,
  { userId, groupId }: { userId: string; groupId: string },
) => {
  const result = await databases.listDocuments<GroupMemberAWModel>(
    DATABASE_ID,
    APPWRITE_GROUP_MEMBERS_ID,
    [
      Query.equal("userId", userId),
      Query.equal("groupId", groupId),
      Query.isNull("leftAt"),
    ],
  )

  return result.documents[0]?.isAdmin ?? false
}

export const setUserAsAdmin = async (
  databases: Databases,
  { userId, groupId }: { userId: string; groupId: string },
) => {
  const result = await databases.listDocuments<GroupMemberAWModel>(
    DATABASE_ID,
    APPWRITE_GROUP_MEMBERS_ID,
    [
      Query.equal("userId", userId),
      Query.equal("groupId", groupId),
      Query.isNull("leftAt"),
    ],
  )

  if (result.total === 0) throw Error()

  return await databases.updateDocument<GroupMemberAWModel>(
    DATABASE_ID,
    APPWRITE_GROUP_MEMBERS_ID,
    result.documents[0]?.$id,
    { isAdmin: true },
  )
}

export const unsetUserAdmin = async (
  databases: Databases,
  { userId, groupId }: { userId: string; groupId: string },
) => {
  const result = await databases.listDocuments<GroupMemberAWModel>(
    DATABASE_ID,
    APPWRITE_GROUP_MEMBERS_ID,
    [
      Query.equal("userId", userId),
      Query.equal("groupId", groupId),
      Query.isNull("leftAt"),
    ],
  )

  if (result.total === 0) throw Error()

  return await databases.updateDocument<GroupMemberAWModel>(
    DATABASE_ID,
    APPWRITE_GROUP_MEMBERS_ID,
    result.documents[0]?.$id,
    { isAdmin: false },
  )
}

export const getGroupAdmins = async (
  databases: Databases,
  { groupId }: { groupId: string },
): Promise<QueryResults<GroupMemberAWModel>> => {
  try {
    const result = await databases.listDocuments<GroupMemberAWModel>(
      DATABASE_ID,
      APPWRITE_GROUP_MEMBERS_ID,
      [
        Query.equal("groupId", groupId),
        Query.equal("isAdmin", true),
        Query.isNull("leftAt"),
      ],
    )

    return {
      total: result.total,
      data: result.documents,
    }
  } catch {
    return {
      total: 0,
      data: [],
    }
  }
}
