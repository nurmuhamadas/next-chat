import ClientError from "./client-error"

class AuthenticationError extends ClientError {
  constructor(public message: string) {
    super(message, 401)
  }
}

export default AuthenticationError
