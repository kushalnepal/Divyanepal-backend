//message , status code,Error codes , error

export class HttpException extends Error {
  status: number;
  message: string;
  errorCode: ErrorCodes;
  errors: any;
  constructor(
    status: number,
    message: string,
    errorCode: ErrorCodes,
    errors: any
  ) {
    super(message);
    this.status = status;
    this.message = message;
    this.errorCode = errorCode;
    this.errors = errors;
  }
}
export enum ErrorCodes {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INVALID_PASSWORD = 1003,
  UNPROCESSABLE_ENTITY = 1004,
  BAD_REQUEST = 3001,
  INTERNAL_SERVER_ERROR = 5001,
  PRODUCT_NOT_FOUND = 2001,
  TOKEN_NOT_FOUND = 4001,
}
