import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { ERROR } from "@/constants/error"
import { sessionMiddleware } from "@/lib/session-middleware"
import { createError, successResponse } from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"
import { zodErrorHandler } from "@/lib/zod-error-handler"

import { getSettings, updateSettings } from "../lib/queries"
import { mapSettingModelToSetting } from "../lib/utils"
import { settingSchema } from "../schema"

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
  .patch(
    "/",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("json", settingSchema, zodErrorHandler),
    async (c) => {
      try {
        const formValue = c.req.valid("json")
        const databases = c.get("databases")
        const currentProfile = c.get("userProfile")

        const result = await getSettings(databases, {
          userId: currentProfile.$id,
        })

        if (!result) {
          throw Error()
        }

        const newSetting = await updateSettings(
          databases,
          result.$id,
          formValue,
        )

        const setting = mapSettingModelToSetting(newSetting)

        const response: GetSettingResponse = successResponse(setting)
        return c.json(response)
      } catch {
        return c.json(createError(ERROR.INTERNAL_SERVER_ERROR), 500)
      }
    },
  )

export default settingApp
