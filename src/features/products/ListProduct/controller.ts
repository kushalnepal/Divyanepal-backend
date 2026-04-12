import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { InternalException } from "../../Exception/internal-exception";
import { ErrorCodes } from "../../Exception/root";

export const ListProduct = async (req: Request, res: Response) => {
  // For list product we need the concept of pagination
  // {
  //     count:100,
  //     data:[]
  // }
  try {
    const prisma = new PrismaClient();
    const count = await prisma.product.count();

    // Support optional pagination via query params: ?take=10&skip=0
    // If `take` is not provided, return all products.
    const rawSkip = Number(req.query.skip);
    const rawTake = Number(req.query.take);
    const skipVal = Number.isFinite(rawSkip) ? rawSkip : 0;
    const takeVal = Number.isFinite(rawTake) ? rawTake : undefined;

    const products = await prisma.product.findMany({
      skip: skipVal,
      ...(typeof takeVal === "number" ? { take: takeVal } : {}),
    });

    // Convert binary image buffers to base64 strings for safe transport to frontend
    const productsWithBase64 = products.map((p: any) => ({
      ...p,
      image: p.image ? Buffer.from(p.image).toString("base64") : null,
    }));

    res.json({
      count,
      data: productsWithBase64,
    });
  } catch (err) {
    throw new InternalException(
      "Some error while finding list",
      ErrorCodes.PRODUCT_NOT_FOUND,
      err,
    );
  }
};
