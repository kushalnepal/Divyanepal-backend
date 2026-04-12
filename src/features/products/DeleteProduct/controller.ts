import { Request, Response } from "express";
import prisma from "../../../prisma-client";
import { NotFoundException } from "../../Exception/notfound-exception";
import { ErrorCodes } from "../../Exception/root";

export const DeleteProduct = async (req: Request, res: Response) => {
  //   const { name, description, price, tags } = req.body;
  try {
    const product = req.body;
    const deleteProduct = await prisma.product.delete({
      where: { id: req.params.id },
    });
    res.json({
      ...deleteProduct,
      message: "Product deleted sucessfully",
    });
  } catch (err) {
    throw new NotFoundException("Product not found", ErrorCodes.USER_NOT_FOUND);
  }
};
