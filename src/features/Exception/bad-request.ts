import { ErrorCodes, HttpException } from "./root";

export class BadRequest extends HttpException {
  constructor(message: string, errorCode: ErrorCodes) {
    super(400, message, errorCode, null);
  }
}
