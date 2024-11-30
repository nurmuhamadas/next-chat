import { mergeName } from "@/lib/utils"

import { BlockedUserResult } from "./queries"

export const mapUserModelToBlockedUser = (
  user: BlockedUserResult,
): BlockedUser => {
  return {
    id: user.$id,
    name: mergeName(user.firstName, user.lastName),
    imageUrl: user.imageUrl ?? null,
  }
}
