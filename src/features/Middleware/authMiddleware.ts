import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../secret";
import { ErrorCodes } from "../Exception/root";
import { UnauthorizedException } from "../Exception/unauthorized";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("Auth Header missing");
      return next(
        new UnauthorizedException(
          "Token not found",
          ErrorCodes.TOKEN_NOT_FOUND,
        ),
      );
    }

    // Handle both "Bearer <token>" and raw token
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      console.log("Token missing after Bearer");
      return next(
        new UnauthorizedException(
          "Token not found",
          ErrorCodes.TOKEN_NOT_FOUND,
        ),
      );
    }

    // Verify the token
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.log("JWT verification failed:", err);
      return next(
        new UnauthorizedException("Invalid Token", ErrorCodes.TOKEN_NOT_FOUND),
      );
    }

    // Get user from DB
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst({
      where: { id: payload.userId },
    });

    if (!user) {
      console.log("User not found for token ID:", payload.userId);
      return next(
        new UnauthorizedException("Invalid Token", ErrorCodes.TOKEN_NOT_FOUND),
      );
    }

    // Attach user to request
    req.user = user;

    next(); // pass control to next middleware
  } catch (err) {
    console.log("AuthMiddleware error:", err);
    return next(
      new UnauthorizedException("Invalid Token", ErrorCodes.TOKEN_NOT_FOUND),
    );
  }
};
