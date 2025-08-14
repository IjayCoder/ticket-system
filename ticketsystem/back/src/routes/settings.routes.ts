import { Router } from "express";
import { authenticateUser, protectedRoute } from "../middlewares/middleware";
import {
  getUserSettings,
  updateUserSettings,
} from "../controller/settings.controller";
import { sanitizeBody } from "../middlewares/sanitizeMiddleware";

const router = Router();

router.use(authenticateUser, protectedRoute);

router.get("/", getUserSettings);
router.patch("/", sanitizeBody, updateUserSettings);

export default router;
