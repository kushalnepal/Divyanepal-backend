import { RequestHandler } from "express";
import prisma from "../../prisma-client";

export const createOrder: RequestHandler = async (req, res) => {
  const { name, phone, orderDetails } = req.body;
  // Validate minimal fields
  if (!name || !phone || !orderDetails) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const order = await (prisma as any).order.create({
    data: {
      name,
      phone,
      orderDetails,
      // status will default to PENDING as per Prisma schema
    },
  });

  res.status(201).json(order);
};

export const completeOrder: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Missing order id" });
    return;
  }

  try {
    const updated = await (prisma as any).order.update({
      where: { id },
      data: { status: "COMPLETED" },
    });

    res.json(updated);
  } catch (err: unknown) {
    // Prisma returns a known error code when a record is not found on update
    if ((err as any)?.code === "P2025") {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    console.error(err);
    res.status(500).json({ message: "Failed to update order" });
    return;
  }
};
