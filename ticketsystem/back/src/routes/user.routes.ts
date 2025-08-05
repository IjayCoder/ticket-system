import { Router } from "express";
import {
  getDev,
  getUserProfile,
  UpdateUserProfile,
} from "../controller/user.controller";
import { authenticateUser, protectedRoute } from "../middlewares/middleware";

const router = Router();

router.use(authenticateUser);

router.get("/me", protectedRoute, getUserProfile);

router.get("/dev", protectedRoute, getDev);

router.patch("/:id", protectedRoute, UpdateUserProfile);

export default router;
