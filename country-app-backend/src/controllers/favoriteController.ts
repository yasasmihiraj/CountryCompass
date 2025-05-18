import { Request, Response } from "express";
import User from "../models/user.model";

// Type to include userId injected by authMiddleware
interface AuthenticatedRequest extends Request {
  userId?: string;
}

// ✅ GET /api/favorites
export const getFavorites = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ favorites: user.favorites || [] });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Error retrieving favorites" });
  }
};

// ✅ POST /api/favorites/add
export const addFavorite = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { countryCode } = req.body;

  if (!countryCode) {
    res.status(400).json({ message: "Missing country code" });
    return;
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.favorites.includes(countryCode)) {
      user.favorites.push(countryCode);
      await user.save();
    }

    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ message: "Error adding favorite" });
  }
};

// ✅ POST /api/favorites/remove
export const removeFavorite = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { countryCode } = req.body;

  if (!countryCode) {
    res.status(400).json({ message: "Missing country code" });
    return;
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.favorites = user.favorites.filter((code) => code !== countryCode);
    await user.save();

    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ message: "Error removing favorite" });
  }
};
