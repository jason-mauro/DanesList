import express, { Request, Response } from "express";
import cors from "cors";
import router from "./routes/auth.routes.js"; 
import dotenv from "dotenv";
import connectDB from "./db/connectToMongo.js";
import cookieParser from "cookie-parser";


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
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", router);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});