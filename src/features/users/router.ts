import { Router } from "express";
import { ErrorHandler } from "../../error-handler";
import { AdminMiddleware } from "../Middleware/adminMiddleware";
import { AuthMiddleware } from "../Middleware/authMiddleware";
import { listUsers } from "./controller";

const router = Router();

// GET /api/admin/users - list users for admin
router.get("/", [AuthMiddleware, AdminMiddleware], ErrorHandler(listUsers));

export default router;
