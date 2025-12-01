import express from "express";
import { getConversationMessages, getUserConversations, sendMessage, sendMessageToUser, checkConversationExists, markConversationAsRead } from "../controllers/message.controller.js";
import protectRoute from "../utils/protectRoute.js";

const messageRouter = express.Router();


messageRouter.get("/conversations", protectRoute, getUserConversations);

messageRouter.get("/conversations/check/:otherUserId", protectRoute, checkConversationExists);

messageRouter.post('/conversations/:conversationId/read', protectRoute, markConversationAsRead);

messageRouter.post("/conversations/:id/messages", protectRoute, sendMessage);

messageRouter.get("/:id/messages", protectRoute, getConversationMessages);

messageRouter.post("/", protectRoute, sendMessageToUser);

export default messageRouter;