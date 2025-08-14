import { NextFunction, Request, Response } from "express";
import cookie from "cookie";
import jwt from "jsonwebtoken";

interface MyTokenPayload {
  id: string;
  email: string;
  role: string;
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.headers.cookie;

  if (!cookies) {
    res.status(401).json({ messag: "No token provided" });
    return;
  }

  const parsedCookies = cookie.parse(cookies);
  const token = parsedCookies.token;

  if (!token) {
    res.status(401).json({ messag: "Authentication token missing" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT as string
    ) as MyTokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};

export const protectedRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized: Please log in first" });
    return;
  }
  next();
};

export const isDevOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user?.role !== "DEV") {
    res.status(403).json({ message: "Access forbidden: DEV only" });
    return;
  }
  next();
};

export const isClientOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user?.role !== "CLIENT") {
    res.status(403).json({ message: "Access forbidden: CLIENT only" });
    return;
  }
  next();
};

export const isAdminOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user?.role !== "ADMIN") {
    res.status(403).json({ message: "Access forbidden: Admin only" });
    return;
  }
  next();
};

export const isAdminOrDev = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "ADMIN" || req.user?.role === "DEV") {
    return next();
  }
  res.status(403).json({ message: "Access denied" });
  return;
};
