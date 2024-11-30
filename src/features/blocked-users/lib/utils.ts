import { mergeName } from "@/lib/utils"

export const mapUserModelToBlockedUser = (user: UserModel): BlockedUser => {
  return {
    id: user.$id,
    name: mergeName(user.firstName, user.lastName),
    imageUrl: user.imageUrl ?? null,
  }
}
