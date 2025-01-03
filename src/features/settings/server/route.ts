import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { prisma } from "@/lib/prisma"
import { sessionMiddleware } from "@/lib/session-middleware"
import { successResponse } from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"

import { createSetting, updateSetting } from "../lib/queries"
import { mapSettingModelToSetting } from "../lib/utils"
import { settingSchema } from "../schema"

const settingApp = new Hono()
  .get("/", sessionMiddleware, validateProfileMiddleware, async (c) => {
    const { userId } = c.get("userProfile")

    const result = await prisma.setting.findUnique({ where: { userId } })

    if (!result) {
      const setting = await createSetting(userId)

      const response: GetSettingResponse = successResponse(
        mapSettingModelToSetting(setting),
      )
      return c.json(response)
    }

    const setting = mapSettingModelToSetting(result)

    const response: GetSettingResponse = successResponse(setting)
    return c.json(response)
  })
  .patch(
    "/",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("json", settingSchema),
    async (c) => {
      const formValue = c.req.valid("json")
      const { userId } = c.get("userProfile")

      let currentSetting = await prisma.setting.findUnique({
        where: { userId },
      })

      if (!currentSetting) {
        currentSetting = await createSetting(userId)
      }

      const newSetting = await updateSetting(currentSetting.id, {
        ...formValue,
        timeFormat:
          formValue.timeFormat === "12-HOUR" ? "HALF_DAY" : "FULL_DAY",
        allowAddToGroup: formValue.allowToAddToGroup,
      })

      const setting = mapSettingModelToSetting(newSetting)

      const response: GetSettingResponse = successResponse(setting)
      return c.json(response)
    },
  )

export default settingApp
