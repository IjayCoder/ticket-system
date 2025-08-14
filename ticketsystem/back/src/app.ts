import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import csrfRoutes from "./routes/csrf.routes";
import authRoutes from "./routes/auth.routes";
import ticketRoutes from "./routes/ticket.routes";
import notificationRoutes from "./routes/notification.routes";
import settingsRoutes from "./routes/settings.routes";
import userRoutes from "./routes/user.routes";

import { csrfProtection } from "./middlewares/csrf.middleware";

export const app = express();

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use(helmet());
app.use(cookieParser());

//  Route to retrieve the CSRF token (accessible without protection).
app.use("/api", csrfRoutes);

// Apply CSRF protection to all sensitive routes.
app.use("/api/auth", csrfProtection, authRoutes);
app.use("/api/user", csrfProtection, userRoutes);
app.use("/api/ticket", csrfProtection, ticketRoutes);
app.use("/api/notification", csrfProtection, notificationRoutes);
app.use("/api/settings", csrfProtection, settingsRoutes);

// 404 handler
app.use("/", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});
