import { Router } from "express";
import { ErrorHandler } from "../../../error-handler";
import { AdminMiddleware } from "../../Middleware/adminMiddleware";
import { AuthMiddleware } from "../../Middleware/authMiddleware";
import { DeleteProduct } from "./controller";

const DeleteProductRouter = Router();

DeleteProductRouter.delete(
  "/:id",
  [AuthMiddleware, AdminMiddleware],
  ErrorHandler(DeleteProduct),
);
export default DeleteProductRouter;
