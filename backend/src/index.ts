import express, { Request, Response } from "express";
import cors from "cors";
import router from "./routes/auth.routes.js"; 
import dotenv from "dotenv";
import connectDB from "./db/connectToMongo.js";


dotenv.config();

const app = express();
// const PORT: number = 3000;
const PORT = process.env.PORT || 5000;

// Cors configuration
const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200 // For legacy browsers
  };

app.use(cors(corsOptions))


// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", router);

// app.get("/", (req: Request, res: Response): void => {
//     res.send("Server is running");
// });

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running at port ${PORT}`);
});



