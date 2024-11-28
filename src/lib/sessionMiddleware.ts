import { createMiddleware } from "hono/factory"
import {
  type Account as AccountType,
  type Databases as DatabasesType,
  Models,
  type Storage as StorageType,
  type Users as UsersType,
} from "node-appwrite"

import { ERROR } from "@/constants/error"

import "server-only"

import { createSessionClient } from "./appwrite"
import { createError } from "./utils"

type AdditionalContext = {
  Variables: {
    account: AccountType
    databases: DatabasesType
    storage: StorageType
    users: UsersType
    user: Models.User<Models.Preferences>
  }
}

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const { account, databases, storage } = await createSessionClient()

    if (!account) {
      const response = createError(ERROR.UNAUTHORIZE)
      return c.json(response, 401)
    }

    const user = await account.get()

    c.set("account", account)
    c.set("storage", storage)
    c.set("databases", databases)
    c.set("user", user)

    await next()
  },
)