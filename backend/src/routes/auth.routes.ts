import express, {Request, Response} from "express";
import {login, signup, logout, authenticate} from "../controllers/auth.controller.js"

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", authenticate, (req: Request, res: Response) => {
    console.log("success auth")
    res.json({user: req.user });
})

export default router;