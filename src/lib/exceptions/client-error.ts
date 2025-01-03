import { StatusCode } from "hono/utils/http-status"

abstract class ClientError extends Error {
  constructor(
    public message: string,
    public statusCode: StatusCode = 400,
  ) {
    super(message)

    this.statusCode = statusCode
  }
}

export default ClientError
