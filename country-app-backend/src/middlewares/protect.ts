import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

interface AuthRequest extends Request {
  user?: any;
}

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // Look for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

export default protect;
