import { Router } from "express";
import {
  authenticateUser,
  isAdminOnly,
  isAdminOrDev,
  isDevOnly,
  protectedRoute,
} from "../middlewares/middleware";
import {
  GetNotification,
  MarkAllNotificationsAsRead,
  MarkNotificationAsRead,
  SendNotification,
} from "../controller/notification.controller";

const router = Router();

router.use(authenticateUser);

router.post("/", protectedRoute, isAdminOrDev, SendNotification);
router.get("/", protectedRoute, GetNotification);
router.patch("/:id/read", protectedRoute, MarkNotificationAsRead);
router.patch("/read-all", protectedRoute, MarkAllNotificationsAsRead);

export default router;
