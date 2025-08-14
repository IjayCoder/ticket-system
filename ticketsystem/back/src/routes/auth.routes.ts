import { Router } from "express";
import { Login, Logout, Register } from "../controller/auth.controller";
import { authenticateUser } from "../middlewares/middleware";
import { validate } from "../validation/validation";
import { loginSchema, signupSchema } from "../validation/auth.schema";
import rateLimit from "express-rate-limit";
import { sanitizeBody } from "../middlewares/sanitizeMiddleware";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 5
  message: {
    error: "TOO_MANY_REQUESTS",
    message: "Too many attempts, please try again later.",
  },
});

const router = Router();

router.post(
  "/register",
  authLimiter,
  sanitizeBody,
  validate(signupSchema),
  Register
);
router.post("/login", sanitizeBody, validate(loginSchema), Login);
router.post("/logout", authenticateUser, Logout);
export default router;
