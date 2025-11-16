import express from "express";
import { getConversationMessages, getUserConversations, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../utils/protectRoute.js";

const router = express.Router();

router.get("/conversations", protectRoute, getUserConversations);

router.post("/:id/messages", protectRoute, getConversationMessages);

router.post("/conversations/:id/messages", protectRoute, sendMessage);

export default router;