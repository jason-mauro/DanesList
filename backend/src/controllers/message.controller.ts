import {Request, Response} from "express";
import Conversation from "../models/conversations.model.js";
import Message from "../models/messages.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// GET /conversations
export const getUserConversations = async (req: Request, res: Response) => {
    try {
        const userID = req.user?._id;

        const conversations = await Conversation.find(({
            participants: userID
        }))
        .populate("participants", "username avatar")
        .populate({
            path: "lastMessage",
            select: "text sender createdAt",
            populate: {path: "sender", select: "username avatar"}
        })
        .sort({updatedAt: -1})

        res.json(conversations)
    } catch (err: any){
        res.status(500).json({error: err.message})
    }
};


// GET /conversations/:id/messages?limit=20&page=1
export const getConversationMessages = async (req: Request, res: Response) => {
    try {
      const { conversationId } = req.params;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      
  
      const messages = await Message.find({ conversation: conversationId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("sender", "username avatar");
  
      res.json(messages.reverse()); // oldest → newest
  
    } catch (err: any) {
      res.status(500).json({ error : err.message });
    }
};


// POST /conversations/:id/messages
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const {conversationId } = req.params;
        const { text } = req.body;
        

        const message = await Message.create({
            conversation: conversationId,
            sender: req.user?._id,
            text
        });

        await Conversation.findByIdAndUpdate(
            conversationId,
            {
                lastMessage: message._id,
                updatedAt: new Date()
            }
        );

        await message.save()

        const populated = await message
        .populate("sender", "username avatar");

        const conversation = await Conversation.findById(conversationId);
        const senderId = req.user?._id.toString();

        const receiverId = conversation?.participants
            .map(id => id.toString())
            .find(id => id !== senderId);


        const receiverSocketId = getReceiverSocketId(receiverId!);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", message);
		}

        res.json(populated);
    } catch (error: any){
        res.status(500).json({error: error.message})
    }
}
