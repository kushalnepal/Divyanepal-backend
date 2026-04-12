import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { NotFoundException } from "../../Exception/notfound-exception";
import { ErrorCodes } from "../../Exception/root";

export const UpdateProduct = async (req: Request, res: Response) => {
  try {
    // Build updates object from request body but avoid modifying immutable fields
    const updates: any = { ...req.body };

    // Remove id if accidentally provided in body
    if (updates.id) delete updates.id;

    // Normalize tags if provided as array
    if (updates.tags && Array.isArray(updates.tags)) {
      updates.tags = updates.tags.join(",");
    }

    // Normalize price if provided as string
    if (updates.price && typeof updates.price === "string") {
      const parsed = parseFloat(updates.price);
      if (!isNaN(parsed)) updates.price = parsed;
      else delete updates.price; // invalid price
    }

    const prisma = new PrismaClient();
    const updateproduct = await prisma.product.update({
      where: { id: req.params.id },
      data: updates,
    });
    res.json(updateproduct);
  } catch (error: any) {
    // Prisma throws a known error code when record not found (P2025)
    if (error?.code === "P2025") {
      throw new NotFoundException(
        "Product not found",
        ErrorCodes.USER_NOT_FOUND,
      );
    }

    console.error("UpdateProduct error:", error);
    throw new NotFoundException("Product not found", ErrorCodes.USER_NOT_FOUND);
  }
};
