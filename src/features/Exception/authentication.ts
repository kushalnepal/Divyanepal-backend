import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../secret";
import { prisma } from "../../index";

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: "Unauthorized - No token provided" });
      return;
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      res.status(401).json({ message: "Unauthorized - Invalid token format" });
      return;
    }

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      res.status(401).json({ message: "Unauthorized - Invalid token" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { id: payload.userId },
    });

    if (!user) {
      res.status(401).json({ message: "Unauthorized - User not found" });
      return;
    }

    (req as any).user = { id: user.id, role: user.role, email: user.email };
    next();
  } catch (error) {
    res.status(500).json({ message: "Authentication error" });
  }
};