import { Router } from "express";
import { Login, Logout, Register } from "../controller/auth.controller";
import { authenticateUser } from "../middlewares/middleware";

const router = Router();

router.post("/register", Register);
router.post("/login", Login);
//router.get("/me", authenticateUser, Me);
router.post("/logout", authenticateUser, Logout);
export default router;
