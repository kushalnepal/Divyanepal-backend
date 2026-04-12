import { NextFunction, Request, Response } from "express";
import { HttpException } from "../Exception/root";

export const errormiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";
  res.status(error.status).json({
    message: error.message,
    errorCode: error.errorCode || "UNKNOWN_ERROR",
    errors: error.errors || null,
  });
};
