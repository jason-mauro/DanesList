import express, { Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js"; 
import listingRouter from "./routes/listing.routes.js"

import dotenv from "dotenv";
import connectDB from "./db/connectToMongo.js";
import cookieParser from "cookie-parser";
import { Category } from "./models/category.model.js";
import { CategoryInputSchema } from "./schemas/category.schema.js";


dotenv.config();

const app = express();
// const PORT: number = 3000;
const PORT: number = Number(process.env.PORT) || 7002;

// Cors configuration
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});


// Middleware
app.use(express.json({ limit: '17mb'}));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/listings", listingRouter )

// Start server
app.listen(PORT, "0.0.0.0", () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});