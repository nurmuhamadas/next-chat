import { SearchUserQueryResult } from "./queries"

export const mapUserModelToUser = (user: UserAWModel): User => {
  return {
    id: user.$id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName ?? null,
    username: user.username,
    gender: user.gender,
    bio: user.bio ?? null,
    imageUrl: user.imageUrl ?? null,
    lastSeenAt: user.lastSeenAt ?? null,
  }
}

export const mapSearchResult = (user: SearchUserQueryResult): UserSearch => {
  return {
    id: user.$id,
    name: user.firstName + (user.lastName ? ` ${user.lastName}` : ""),
    imageUrl: user.imageUrl ?? null,
    lastSeenAt: user.lastSeenAt ?? null,
  }
}
