import { Router } from "express";
import { completeOrder, createOrder } from "./controller";

const OrdersRouter = Router();

// Public endpoint to create an order (status defaults to PENDING)
OrdersRouter.post("/", createOrder);

// Mark order as completed
OrdersRouter.put("/:id/complete", completeOrder);

export default OrdersRouter;
