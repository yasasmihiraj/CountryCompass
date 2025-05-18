// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // Bearer <token>

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.userId = decoded.id; // ✅ FIXED
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};
