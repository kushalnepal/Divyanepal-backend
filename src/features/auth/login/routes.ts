import { Router } from "express";
import { ErrorHandler } from "../../../error-handler";
import { loginController } from "./controller";

const loginRouter = Router();

loginRouter.post("/login", ErrorHandler(loginController));

export default loginRouter;
