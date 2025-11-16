import {Request, Response} from "express";
import bcrypt from "bcryptjs";
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

        generateTokenAndSetCookie(newUser._id, res);

        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.firstName + " " + newUser.lastName,
            username: newUser.username
        })
    } catch (error){
        res.status(500).json({ error: "Internal Server Error"});
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
            username: user.username
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