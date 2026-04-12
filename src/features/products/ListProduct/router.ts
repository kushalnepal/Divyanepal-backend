import { Router } from "express";
import { ErrorHandler } from "../../../error-handler";
import { ListProduct } from "./controller";

const ListProductRouter = Router();
// Expose product listing as a public endpoint so the frontend can fetch products without admin/auth
ListProductRouter.get("/", ErrorHandler(ListProduct));

export default ListProductRouter;
