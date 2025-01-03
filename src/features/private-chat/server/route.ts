import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"

import { ERROR } from "@/constants/error"
import NotFoundError from "@/lib/exceptions/not-found-error"
import { prisma } from "@/lib/prisma"
import { sessionMiddleware } from "@/lib/session-middleware"
import { successResponse } from "@/lib/utils"
import { validateProfileMiddleware } from "@/lib/validate-profile-middleware"

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
        throw new NotFoundError(ERROR.USER_NOT_FOUND)
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
        throw new NotFoundError(ERROR.PRIVATE_CHAT_OPTION_NOT_FOUND)
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
    zValidator("json", updatePrivateChatOptionSchema),
    async (c) => {
      const { userId: userReqId } = c.req.param()
      const { notification } = c.req.valid("json")

      const { userId } = c.get("userProfile")

      const user = await prisma.user.findUnique({
        where: { id: userReqId },
      })

      if (!user) {
        throw new NotFoundError(ERROR.USER_NOT_FOUND)
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
        throw new NotFoundError(ERROR.PRIVATE_CHAT_OPTION_NOT_FOUND)
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
        throw new NotFoundError(ERROR.USER_NOT_FOUND)
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
        throw new NotFoundError(ERROR.PRIVATE_CHAT_OPTION_NOT_FOUND)
      }

      await clearPrivateChat({ userId, lastOption: option })

      const response: DeleteAllPrivateChatResponse = successResponse(true)
      return c.json(response)
    },
  )
export default privateChatApp
