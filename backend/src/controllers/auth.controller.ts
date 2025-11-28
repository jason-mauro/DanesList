import {Request, Response, NextFunction} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { SignupSchema, UserLoginSchema } from "../schemas/user.schema.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req: Request, res: Response) => {
    try{
        const userData = SignupSchema.parse(req.body);

        const existingUser = await User.findOne({
            $or: [
                { username: userData.username },
                { email: userData.email },
            ],
        });
    
        if (existingUser) {
            return res.status(400).json({ error: "Username or email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        userData.password = hashedPassword;

        const newUser = new User(userData);

        await newUser.save();

        generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.firstName + " " + newUser.lastName,
            username: newUser.username,
            email: newUser.email,
            avatar: newUser.avatar
        })

    } catch (error: any){
        console.log("Error in signup controller:", error);
        res.status(500).json({ error: "Internal Server Error: " + error.message });
    }
}

export const login = async (req: Request, res: Response) => {
    try {

        const loginData = UserLoginSchema.parse(req.body);

        const user = await User.findOne({email: loginData.email})
        
        const isPasswordCorrect = await bcrypt.compare(loginData.password, user?.password || "")

        if (!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid username or password"})
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(201).json({
            _id: user._id,
            fullName: user.firstName + " " + user.lastName,
            username: user.username,
            email: user.email,
            avatar: user.avatar
        })

    } catch (error: any) {
        console.log("Error occured in auth.controller.login", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
}


export const logout = (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({ message: "Logged out successfully" });
	} catch (error: any) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export const authenticate = async (req: Request, res: Response, next: NextFunction)  => {
    console.log("Authenticating")
    const token = req.cookies.jwt;

    if (!token) {
        console.log("no token")
        return res.status(401).json({message: "Not authenticated"})
    }
    console.log("token")
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {userId: string};

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });
        console.log("Sucessful authenticated")
        req.user = user;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token"})
    }

}
