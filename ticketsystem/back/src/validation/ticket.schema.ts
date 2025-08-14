import { z } from "zod";

export const createTicketSchema = z.object({
  title: z
    .string()
    .min(3, { message: "title must be at least 3 characters long" })
    .max(20, { message: "title must be at most 20 characters long" }),

  description: z
    .string()
    .min(10, { message: "title must be at least 3 characters long" }),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["UNOPEN", "OPEN", "IN_PROGRESS", "RESOLVED"]).optional(), // status optionnel à la création
  assignedTo: z.string().uuid().optional(),
});

export const updateTicketSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(10).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["UNOPEN", "OPEN", "IN_PROGRESS", "RESOLVED"]).optional(), // status optionnel à la création
  assignedTo: z.string().uuid().optional(),
});
