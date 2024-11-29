import { SearchUserQueryResult } from "./queries"

export const mapUserModelToUser = (user: UserModel): User => {
  return {
    id: user.$id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName ?? undefined,
    username: user.username,
    gender: user.gender,
    bio: user.bio ?? undefined,
    imageUrl: user.imageUrl ?? undefined,
    lastSeenAt: user.lastSeenAt ? new Date(user.lastSeenAt) : undefined,
  }
}

export const mapSearchResult = (user: SearchUserQueryResult): UserSearch => {
  return {
    id: user.$id,
    name: user.firstName + (user.lastName ? ` ${user.lastName}` : ""),
    imageUrl: user.imageUrl ?? undefined,
    lastSeenAt: user.lastSeenAt ? new Date(user.lastSeenAt) : undefined,
  }
}
