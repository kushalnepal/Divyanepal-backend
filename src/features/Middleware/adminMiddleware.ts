import { NextFunction, Request, Response } from "express";
import { ErrorCodes } from "../Exception/root";
import { UnauthorizedException } from "../Exception/unauthorized";

export const AdminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user.role === "ADMIN") {
    next();
  } else {
    next(new UnauthorizedException("UNAUTHORIZED", ErrorCodes.TOKEN_NOT_FOUND));
  }
};
