import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { NotFoundException } from "../../Exception/notfound-exception";
import { ErrorCodes } from "../../Exception/root";

export const GetProductById = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    const prisma = new PrismaClient();
    const getproduct = await prisma.product.findFirst({
      where: { id: req.params.id },
    });
    res.json({
      ...product,
      getproduct,
    });
  } catch (err) {
    throw new NotFoundException(
      "Some error while finding list By Id",
      ErrorCodes.USER_NOT_FOUND,
    );
  }
};
