import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";
import { Request, Response } from "express";

const router = express.Router();

// Register and login routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔴 NEW Logout Route 🔴
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token"); // Clear token if using cookies
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;