import { Request, Response } from "express";
import { User } from "../models/user.model.js"; // Adjust path to match your setup

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id; // Make sure `protectRoute` adds `user` to req
    const { username, email, profilePicture, password } = req.body;

    const updateFields: any = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (profilePicture) updateFields.profilePic = profilePicture;
    if (password) updateFields.password = password; // Consider hashing if not already handled in User model

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ message: "User update failed" });
  }
};