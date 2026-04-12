import { Router } from "express";
import { ErrorHandler } from "../../../error-handler";
import { Signup } from "./controller";

const signupRouter = Router();

signupRouter.post("/signup", ErrorHandler(Signup));

export default signupRouter;
