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
    lastSeenAt: user.lastSeenAt ?? undefined,
  }
}
