// src/validation/notification.schema.ts
import { z } from "zod";

export const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(3, "Titre trop court"),
  message: z.string().min(5, "Message trop court"),
  type: z.enum(["info", "warning", "success", "error"]),
  ticketId: z.string().uuid().optional(),
});

export const markAsReadSchema = z.object({
  id: z.string().cuid(),
});
