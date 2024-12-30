import {
  Profile as ProfileModel,
  Setting as SettingModel,
  User,
} from "@prisma/client"

export const mapProfileModelToProfile = (
  profile: ProfileModel & { user: Pick<User, "username" | "email"> },
): Profile => {
  return {
    id: profile.id,
    username: profile.user.username,
    email: profile.user.email,
    name: profile.name,
    bio: profile.bio,
    gender: profile.gender,
    imageUrl: profile.imageUrl,
    lastSeenAt: profile.lastSeenAt?.toISOString() ?? null,
  }
}

export const mapSearchResult = (
  profile: Pick<ProfileModel, "name" | "userId" | "imageUrl" | "lastSeenAt">,
): UserSearch => {
  return {
    id: profile.userId,
    name: profile.name,
    imageUrl: profile.imageUrl,
    lastSeenAt: profile.lastSeenAt?.toISOString() ?? null,
  }
}

export const mapSearchForMemberResult = (
  profile: Pick<ProfileModel, "name" | "userId" | "imageUrl" | "lastSeenAt"> & {
    user: { setting: Pick<SettingModel, "allowAddToGroup"> | null }
  },
): UserSearchForMember => {
  return {
    id: profile.userId,
    name: profile.name,
    imageUrl: profile.imageUrl,
    lastSeenAt: profile.lastSeenAt?.toISOString() ?? null,
    allowAddToGroup: profile.user.setting?.allowAddToGroup ?? false,
  }
}
