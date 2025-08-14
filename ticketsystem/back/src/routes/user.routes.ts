import { Router } from "express";
import {
  getDev,
  getUserProfile,
  UpdateUserProfile,
} from "../controller/user.controller";
import { authenticateUser, protectedRoute } from "../middlewares/middleware";
import { sanitizeBody } from "../middlewares/sanitizeMiddleware";

const router = Router();

router.use(authenticateUser);

router.get("/me", protectedRoute, getUserProfile);

router.get("/dev", protectedRoute, getDev);

router.patch("/:id", sanitizeBody, protectedRoute, UpdateUserProfile);

export default router;
