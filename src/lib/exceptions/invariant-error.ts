import ClientError from "./client-error"

class InvariantError extends ClientError {
  constructor(
    public message: string,
    public path?: (string | number)[],
  ) {
    super(message)
  }
}

export default InvariantError
