/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { Context } from "hono"
import { BlankEnv, HTTPResponseError } from "hono/types"
import { ZodError } from "zod"

import ClientError from "./exceptions/client-error"
import { getI18n } from "./locale/server"
import { customLogger } from "./custom-logger"
import { createError } from "./utils"

export const honoErrorHandler = async (
  error: Error | HTTPResponseError,
  c: Context<BlankEnv>,
) => {
  const t = await getI18n()

  if (error instanceof ClientError) {
    customLogger(
      "ERROR:",
      `Message: ${error.message}`,
      `code: ${error.statusCode}`,
    )
    return c.json(
      createError(t(error.message as any, { count: 0 })),
      error.statusCode,
    )
  }

  if (error instanceof ZodError) {
    const response = createError(
      t(error.errors[0]?.message as any, { count: 0 }),
      error.errors[0]?.path,
    )
    return c.json(response, 400)
  }

  if (error instanceof PrismaClientKnownRequestError) {
    customLogger("ERROR:", `Message: ${error.message}`)
    return c.json(createError(t("error.common.internal_server_error")), 500)
  }

  customLogger("ERROR:", `Message: ${error.message}`)
  return c.json(createError(t("error.common.internal_server_error")), 500)
}