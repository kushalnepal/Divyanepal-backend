import { Router } from "express";
import { ErrorHandler } from "../../../error-handler";
import { AdminMiddleware } from "../../Middleware/adminMiddleware";
import { AuthMiddleware } from "../../Middleware/authMiddleware";
import { UpdateProduct } from "./controller";

const UpdateProductRouter = Router();

UpdateProductRouter.put(
  "/:id",
  [AuthMiddleware, AdminMiddleware],
  ErrorHandler(UpdateProduct),
);
export default UpdateProductRouter;
