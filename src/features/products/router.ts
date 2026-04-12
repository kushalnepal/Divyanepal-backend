import { Router } from "express";
import CreateProductRouter from "./CreateProduct/router";
import DeleteProductRouter from "./DeleteProduct/router";
import GetProductByIdRouter from "./GetProductById/router";
import ListProductRouter from "./ListProduct/router";
import UpdateProductRouter from "./UpdateProduct/router";

const productRouter = Router();

productRouter.use(CreateProductRouter);
productRouter.use(DeleteProductRouter);
productRouter.use(GetProductByIdRouter);
productRouter.use(ListProductRouter);
productRouter.use(UpdateProductRouter);

export default productRouter;
