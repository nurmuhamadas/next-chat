import "server-only"

import { createMiddleware } from "hono/factory"
import {
  type Account as AccountType,
  type Databases as DatabasesType,
  Models,
  type Storage as StorageType,
} from "node-appwrite"

import { ERROR } from "@/constants/error"
import { getUserByEmail } from "@/features/user/lib/queries"

import { createError } from "./utils"

type AdditionalContext = {
  Variables: {
    userProfile: UserAWModel
    account: AccountType
    databases: DatabasesType
    storage: StorageType
    userAccount: Models.User<Models.Preferences>
  }
}

/** Check if user already complete the profile<br />
 * * **IMPORTANT** should place after sessionMiddleware
 */
export const validateProfileMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const databases = c.get("databases")
    const user = c.get("userAccount")

    const profile = await getUserByEmail(databases, { email: user.email })

    if (!profile) {
      return c.json(createError(ERROR.COMPLETE_PROFILE_FIRST), 403)
    }

    c.set("userProfile", profile)

    await next()
  },
)
