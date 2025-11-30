import express from "express";
import { updateUser } from "../controllers/user.controller.js";
import protectRoute from "../utils/protectRoute.js";

const router = express.Router();

router.put("/update", protectRoute, updateUser);

export default router;