import { Router } from "express";
import { ErrorHandler } from "../../../error-handler";
import { AdminMiddleware } from "../../Middleware/adminMiddleware";
import { AuthMiddleware } from "../../Middleware/authMiddleware";
import { GetProductById } from "./controller";

const GetProductByIdRouter = Router();

GetProductByIdRouter.get(
  "/:id",
  [AuthMiddleware, AdminMiddleware],
  ErrorHandler(GetProductById),
);
export default GetProductByIdRouter;
