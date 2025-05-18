import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import protectedRoutes from "./routes/protectedRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);

app.use("/api/favorites", favoriteRoutes);

app.get("/", (_req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
