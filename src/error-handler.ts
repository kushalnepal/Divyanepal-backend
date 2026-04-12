// Generic error handling code

import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { BadRequest } from "./features/Exception/bad-request";
import { ErrorCodes, HttpException } from "./features/Exception/root";

export const ErrorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (err: any) {
      console.log(err);
      let exception = <any>HttpException;
      if (err instanceof HttpException) {
        exception = err;
      } else if (err instanceof ZodError) {
        exception = new BadRequest(
          "Unprocessed Entity , missing or Json error",
          ErrorCodes.UNPROCESSABLE_ENTITY
        );
      } else {
        exception = new HttpException(
          500,
          "Internal server error",
          ErrorCodes.INTERNAL_SERVER_ERROR,
          err?.issues
        );
      }
      next(exception);
    }
  };
};
