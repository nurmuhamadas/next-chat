import "server-only"

import { createMiddleware } from "hono/factory"
import {
  type Account as AccountType,
  type Databases as DatabasesType,
  Models,
  type Storage as StorageType,
} from "node-appwrite"

import { ERROR } from "@/constants/error"

import { createSessionClient } from "./appwrite"
import { createError } from "./utils"

type AdditionalContext = {
  Variables: {
    account: AccountType
    databases: DatabasesType
    storage: StorageType
    userAccount: Models.User<Models.Preferences>
  }
}

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    try {
      const { account, databases, storage } = await createSessionClient()

      if (!account) {
        return c.json(createError(ERROR.UNAUTHORIZE), 401)
      }

      const user = await account.get()

      c.set("account", account)
      c.set("account", account)
      c.set("storage", storage)
      c.set("databases", databases)
      c.set("userAccount", user)

      await next()
    } catch {
      return c.json(createError(ERROR.UNAUTHORIZE), 401)
    }
  },
)
