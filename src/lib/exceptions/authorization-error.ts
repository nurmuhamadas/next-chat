import ClientError from "./client-error"

class AuthorizationError extends ClientError {
  constructor(public message: string) {
    super(message, 403)
  }
}

export default AuthorizationError
