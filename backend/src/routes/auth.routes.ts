import express, {Request, Response} from "express";
import {login, signup, logout, authenticate} from "../controllers/auth.controller.js"

const authRouter = express.Router();

authRouter.post("/signup", signup);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.get("/me", authenticate, (req: Request, res: Response) => {
    console.log("success auth")
    res.json({user: req.user });
})

export default authRouter;