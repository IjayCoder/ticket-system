import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import ticketRoutes from "./routes/ticket.routes";
import notificationRoutes from "./routes/notification.routes";
import settingsRoutes from "./routes/settings.routes";
import userRoutes from "./routes/user.routes";

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

//  Route

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/settings", settingsRoutes);

// 404 handler
app.use("/", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});
