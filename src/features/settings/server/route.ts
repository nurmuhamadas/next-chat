import { Hono } from "hono"

import { ERROR } from "@/constants/error"
import { sessionMiddleware } from "@/lib/session-middleware"
import { createError, successResponse } from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"
import { getSettings } from "../lib/queries"
import { mapSettingModelToSetting } from "../lib/utils"

const settingApp = new Hono()
  .get("/", sessionMiddleware, validateProfileMiddleware, async (c) => {
    try {
      const databases = c.get("databases")
      const currentProfile = c.get("userProfile")

      const result = await getSettings(databases, {
        userId: currentProfile.$id,
      })

      if (!result) {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }

      const setting = mapSettingModelToSetting(result)

      const response: GetSettingResponse = successResponse(setting)
      return c.json(response)
    } catch {
      return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
    }
  })
  .patch()

export default settingApp
