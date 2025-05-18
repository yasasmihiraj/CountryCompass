import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.ts";
import { getFavorites, addFavorite, removeFavorite } from "../controllers/favoriteController";

const router = express.Router();

router.get("/", authenticateToken, getFavorites);
router.post("/add", authenticateToken, addFavorite);
router.post("/remove", authenticateToken, removeFavorite);

export default router;
