import { Router } from "express";
import {
  authenticateUser,
  isAdminOrDev,
  protectedRoute,
} from "../middlewares/middleware";
import {
  GetNotification,
  MarkAllNotificationsAsRead,
  MarkNotificationAsRead,
  SendNotification,
} from "../controller/notification.controller";
import { sanitizeBody } from "../middlewares/sanitizeMiddleware";

const router = Router();

router.use(authenticateUser);

router.post("/", sanitizeBody, protectedRoute, isAdminOrDev, SendNotification);
router.get("/", protectedRoute, GetNotification);
router.patch("/:id/read", sanitizeBody, protectedRoute, MarkNotificationAsRead);
router.patch(
  "/read-all",
  sanitizeBody,
  protectedRoute,
  MarkAllNotificationsAsRead
);

export default router;
