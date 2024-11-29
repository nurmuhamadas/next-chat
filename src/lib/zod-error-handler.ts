import { Context, Env } from "hono"
import { ZodError } from "zod"

import { createError } from "./utils"

type Result =
  | {
      success: true
      data: unknown
    }
  | {
      success: false
      error: ZodError
    }

export const zodErrorHandler = (result: Result, c: Context<Env, string>) => {
  if (!result.success) {
    const response = createError(
      result.error.errors[0]?.message,
      result.error.errors[0]?.path,
    )

    return c.json(response, 400)
  }
}
