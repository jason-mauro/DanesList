import express from "express";
import { banUser, updateUser } from "../controllers/user.controller.js";
import protectRoute from "../utils/protectRoute.js";

const router = express.Router();

router.put("/update", protectRoute, updateUser);

router.post("/ban/:id", protectRoute, banUser)

export default router;