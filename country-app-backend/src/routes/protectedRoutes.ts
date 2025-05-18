// src/routes/protectedRoutes.ts
import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.ts";
 

const router = express.Router();

router.get("/profile", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Access granted to protected profile data!" });
});

export default router;
