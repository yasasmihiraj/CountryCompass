import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config(); // Load environment variables

// Validate JWT Secret on startup
if (!process.env.JWT_SECRET) {
  throw new Error("❌ Missing JWT_SECRET in environment variables");
}

// Helper: Securely generate JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

// POST /api/auth/register
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      res.status(400).json({ message: "❌ All fields are required" });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "❌ User already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.trim(), salt);

    const user = new User({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    console.error("❌ Error in registerUser:", error);
    res.status(500).json({ message: "⚠ Internal server error" });
  }
};

// POST /api/auth/login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email?.trim() || !password?.trim()) {
      res.status(400).json({ message: "❌ Email and password are required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "❌ Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
      res.status(401).json({ message: "❌ Invalid credentials" });
      return;
    }

    res.json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    console.error("❌ Error in loginUser:", error);
    res.status(500).json({ message: "⚠ Internal server error" });
  }
};