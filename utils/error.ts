class CustomError extends Error {
  constructor(msg: string) {
    super(msg)
  }
}

export const custError = (msg: string) => new CustomError(msg)