import { Router } from "express";
import {
  createTicket,
  deleteTicket,
  filterTicketPriority,
  filterTicketStatus,
  getDashboardStats,
  getMyTickets,
  getTicketById,
  getTickets,
  updateTicket,
  updateTicketStatus,
} from "../controller/ticket.controller";
import {
  authenticateUser,
  isAdminOnly,
  isClientOnly,
  isDevOnly,
  protectedRoute,
} from "../middlewares/middleware";
import { sanitizeBody } from "../middlewares/sanitizeMiddleware";

const router = Router();
router.use(authenticateUser);

router.post("/", sanitizeBody, protectedRoute, isClientOnly, createTicket);
router.get("/", protectedRoute, isAdminOnly, getTickets);
router.get("/user", protectedRoute, getMyTickets);

router.get("/stats", protectedRoute, getDashboardStats);

router.get("/:id", protectedRoute, getTicketById);
router.patch("/:id", sanitizeBody, protectedRoute, isClientOnly, updateTicket);

router.put(
  "/status/:id",
  sanitizeBody,
  protectedRoute,
  isDevOnly,
  updateTicketStatus
);

router.get("/priority", protectedRoute, isAdminOnly, filterTicketPriority);
router.get("/status", protectedRoute, isAdminOnly, filterTicketStatus);

router.delete("/:id", protectedRoute, deleteTicket);

export default router;
