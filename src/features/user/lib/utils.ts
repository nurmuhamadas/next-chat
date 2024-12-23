import { Profile as ProfileModel, User } from "@prisma/client"

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
  user: Pick<ProfileModel, "name" | "id" | "imageUrl" | "lastSeenAt">,
): UserSearch => {
  return {
    id: user.id,
    name: user.name,
    imageUrl: user.imageUrl,
    lastSeenAt: user.lastSeenAt?.toISOString() ?? null,
  }
}
