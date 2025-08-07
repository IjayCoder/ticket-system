import express from "express";
import cors from "cors";
export const app = express();
import authRoutes from "./routes/auth.routes";
import ticketRoutes from "./routes/ticket.routes";
import notificationRoutes from "./routes/notification.routes";
import settingsRoutes from "./routes/settings.routes";

import userRoutes from "./routes/user.routes";
import cookieParser from "cookie-parser";

//middlewares
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "https://ijayticketsystem.web.app",
  })
);
app.use(cookieParser());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ticket", ticketRoutes);

app.use("/api/notification", notificationRoutes);

app.use("/api/settings", settingsRoutes);

//404 handler
app.use("/", (req, res) => {
  res.status(404).send("routes not found");
});
