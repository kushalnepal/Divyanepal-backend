import { ErrorCodes, HttpException } from "./root";

export class NotFoundException extends HttpException {
  constructor(message: string, errorCode: ErrorCodes) {
    super(404, message, errorCode, null);
  }
}
