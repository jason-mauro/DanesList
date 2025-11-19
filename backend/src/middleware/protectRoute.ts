// middleware/protectRoute.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model.js";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    // Extract token (format: "Bearer TOKEN")
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    // Find user by ID from token
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach user to request object - using the correct type
    req.user = user;
    next();
  } catch (error: any) {
    console.log("Error in protectRoute middleware:", error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Unauthorized - Token expired" });
    }
    
    res.status(500).json({ error: "Internal server error" });
  }
};