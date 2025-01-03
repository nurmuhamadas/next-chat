import ClientError from "./client-error"

class NotFoundError extends ClientError {
  constructor(public message: string) {
    super(message, 404)
  }
}

export default NotFoundError
