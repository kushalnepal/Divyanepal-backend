import { Router } from "express";

import loginRouter from "./auth/login/routes";
import signupRouter from "./auth/signup/routes";
import templeRouter from "./temples/routes";
import packageRouter from "./packages/routes";
import bookingRouter from "./bookings/routes";
import contactRouter from "./contact/routes";

const mainRouter = Router();

mainRouter.use("/auth", loginRouter);
mainRouter.use("/auth", signupRouter);
mainRouter.use("/temples", templeRouter);
mainRouter.use("/packages", packageRouter);
mainRouter.use("/bookings", bookingRouter);
mainRouter.use("/contact", contactRouter);

export default mainRouter;