import { BlockedUser as BlockedUserModel, Profile } from "@prisma/client"

export const mapBlockedUserModelToBlockedUser = (
  user: Pick<BlockedUserModel, "id"> & {
    blockedUser: {
      id: string
      profile: Pick<Profile, "name" | "imageUrl"> | null
    }
  },
): BlockedUser => {
  return {
    id: user.blockedUser.id,
    name: user.blockedUser.profile?.name ?? "",
    imageUrl: user.blockedUser.profile?.imageUrl ?? null,
  }
}
