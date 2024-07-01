class CustomError extends Error {
  constructor(msg: string, errorName: string) {
    super(msg)
    this.name = errorName
  }
}

export const custError = (msg: string, errorName = 'CustomError') => new CustomError(msg, errorName)