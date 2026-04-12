import { Request, Response } from "express";
import prisma from "../../prisma-client";
import { NotFoundException } from "../Exception/notfound-exception";
import { ErrorCodes } from "../Exception/root";

export const listUsers = async (req: Request, res: Response) => {
  try {
    // Return users without passwords
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(users);
  } catch (err) {
    throw new NotFoundException(
      "Some error while fetching users",
      ErrorCodes.USER_NOT_FOUND,
    );
  }
};
