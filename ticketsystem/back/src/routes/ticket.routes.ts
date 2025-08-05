import { Router } from "express";
import {
  createTicket,
  deleteTicket,
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

const router = Router();
router.use(authenticateUser);

router.post("/", protectedRoute, isClientOnly, createTicket);
router.get("/", protectedRoute, isAdminOnly, getTickets);
router.get("/user", protectedRoute, getMyTickets);

router.get("/stats", protectedRoute, getDashboardStats);

router.get("/:id", protectedRoute, getTicketById);
router.patch("/:id", protectedRoute, isClientOnly, updateTicket);

router.put("/status/:id", protectedRoute, isDevOnly, updateTicketStatus);
router.delete("/:id", protectedRoute, deleteTicket);

export default router;
