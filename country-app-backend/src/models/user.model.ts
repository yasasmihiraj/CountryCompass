import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: [{ type: String }] // Store country codes (like "US", "IN", "FR")
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
