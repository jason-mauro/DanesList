import { Request, Response } from "express";
import { User } from "../models/user.model.js"; // Adjust path to match your setup
import { UserUpdateSchema } from "../schemas/user.schema.js"; // or wherever you put it
import bcrypt from "bcryptjs";


export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Validate input using Zod
    const updateData = UserUpdateSchema.parse(req.body);

    // Check for unique username/email if changed
    if (updateData.username) {
      const existingUsername = await User.findOne({ username: updateData.username, _id: { $ne: userId } });
      if (existingUsername) {
        return res.status(400).json({ message: "Username is already taken" });
      }
    }

    if (updateData.email) {
      const existingEmail = await User.findOne({ email: updateData.email, _id: { $ne: userId } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email is already taken" });
      }
    }

    // If password is provided, hash it
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User updated successfully" });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Failed to update user" });
  }
};