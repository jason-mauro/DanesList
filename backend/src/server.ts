import express, { Request, Response } from "express";


const app = express();
const PORT: number = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response): void => {
    res.send("Server is running");
});

app.listen(PORT, (): void => {
    console.log("Server is running at port 5000")
});