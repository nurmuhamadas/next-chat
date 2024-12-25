import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { ERROR } from "@/constants/error"
import { prisma } from "@/lib/prisma"
import { sessionMiddleware } from "@/lib/session-middleware"
import { createError, successResponse } from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"
import { zodErrorHandler } from "@/lib/zod-error-handler"

import { clearPrivateChat } from "../lib/queries"
import { mapOptionModelToOption } from "../lib/utils"
import { updatePrivateChatOptionSchema } from "../schema"

const privateChatApp = new Hono()
  .get(
    "/:userId/options",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const { userId: userReqId } = c.req.param()

      const { userId } = c.get("userProfile")

      const user = await prisma.user.findUnique({
        where: { id: userReqId },
      })

      if (!user) {
        return c.json(createError(ERROR.USER_NOT_FOUND), 404)
      }

      const option = await prisma.privateChatOption.findFirst({
        where: {
          userId,
          deletedAt: null,
          privateChat: {
            OR: [
              { user1Id: userReqId, user2Id: userId },
              { user2Id: userReqId, user1Id: userId },
            ],
          },
        },
      })

      if (!option) {
        return c.json(createError(ERROR.PRIVATE_CHAT_OPTION_NOT_FOUND), 404)
      }

      const response: GetPrivateChatOptionResponse = successResponse(
        mapOptionModelToOption(option),
      )
      return c.json(response)
    },
  )
  .patch(
    "/:userId/options",
    sessionMiddleware,
    validateProfileMiddleware,
    zValidator("json", updatePrivateChatOptionSchema, zodErrorHandler),
    async (c) => {
      const { userId: userReqId } = c.req.param()
      const { notification } = c.req.valid("json")

      const { userId } = c.get("userProfile")

      const user = await prisma.user.findUnique({
        where: { id: userReqId },
      })

      if (!user) {
        return c.json(createError(ERROR.USER_NOT_FOUND), 404)
      }

      const option = await prisma.privateChatOption.findFirst({
        where: {
          userId,
          deletedAt: null,
          privateChat: {
            OR: [
              { user1Id: userReqId, user2Id: userId },
              { user2Id: userReqId, user1Id: userId },
            ],
          },
        },
      })

      if (!option) {
        return c.json(createError(ERROR.PRIVATE_CHAT_OPTION_NOT_FOUND), 404)
      }

      const result = await prisma.privateChatOption.update({
        where: { id: option.id },
        data: { notification },
      })

      const response: UpdatePrivateChatOptionResponse = successResponse(
        mapOptionModelToOption(result),
      )
      return c.json(response)
    },
  )
  .delete(
    "/:userId/chat",
    sessionMiddleware,
    validateProfileMiddleware,
    async (c) => {
      const { userId: userReqId } = c.req.param()

      const { userId } = c.get("userProfile")

      const user = await prisma.user.findUnique({
        where: { id: userReqId },
      })

      if (!user) {
        return c.json(createError(ERROR.USER_NOT_FOUND), 404)
      }

      const option = await prisma.privateChatOption.findFirst({
        where: {
          userId,
          deletedAt: null,
          privateChat: {
            OR: [
              { user1Id: userReqId, user2Id: userId },
              { user2Id: userReqId, user1Id: userId },
            ],
          },
        },
      })

      if (!option) {
        return c.json(createError(ERROR.PRIVATE_CHAT_OPTION_NOT_FOUND), 404)
      }

      await clearPrivateChat({ userId, lastOption: option })

      const response: DeleteAllPrivateChatResponse = successResponse(true)
      return c.json(response)
    },
  )
export default privateChatApp
