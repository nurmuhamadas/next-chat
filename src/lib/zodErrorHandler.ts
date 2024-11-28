import { Context, Env } from "hono"
import { ZodError } from "zod"

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
    const response: ErrorResponse = {
      success: false,
      error: {
        message: result.error.errors[0]?.message,
        path: result.error.errors[0]?.path,
      },
    }

    c.json(response)
  }
}
