import { Router } from "express";
import {
  authenticateUser,
  isAdminOrDev,
  protectedRoute,
} from "../middlewares/middleware";
import {
  getUserSettings,
  updateUserSettings,
} from "../controller/settings.controller";

const router = Router();

router.use(authenticateUser, protectedRoute);

router.get("/", getUserSettings);
router.patch("/", updateUserSettings);

export default router;
