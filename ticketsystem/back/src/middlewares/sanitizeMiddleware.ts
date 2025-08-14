import type { Request, Response, NextFunction } from "express";
import { sanitizeInput } from "../utils/sanitize";

export function sanitizeBody(req: Request, _res: Response, next: NextFunction) {
  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = sanitizeInput(req.body[key]);
    }
  }
  next();
}
