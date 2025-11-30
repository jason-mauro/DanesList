import {Request, Response} from "express";
import Conversation from "../models/conversations.model.js";
import Message from "../models/messages.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// GET /conversations
export const getUserConversations = async (req: Request, res: Response) => {
    try {
        const userID = req.user?._id;

        const conversations = await Conversation.find({
            participants: userID
        })
        .populate({
            path: "participants",
            match: { _id: { $ne: userID } }, // Only populate the other user
            select: "-password"
        })
        .sort({ updatedAt: -1 });

        // Clean up the response - participants will be an array with one user
        const formattedConversations = await Promise.all(conversations.map(async(conv) => {
            const lastMessage = await Message.findById(conv.lastMessage);
            return ({
                conversationId: conv._id,
                lastMessage: lastMessage?.message,
                otherUser: conv.participants[0], // The other person
                updatedAt: conv.updatedAt
            });
        }));



        res.json(formattedConversations);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};


// GET /conversations/:id/messages?limit=20&page=1
export const getConversationMessages = async (req: Request, res: Response) => {
    try {
      const { conversationId } = req.params;
    
      const messages = await Message.find({ conversation: conversationId })
        .sort({ createdAt: -1 });
  
      res.json(messages.reverse()); // oldest → newest
  
    } catch (err: any) {
      res.status(500).json({ error : err.message });
    }
};

// Alternative: POST /messages - Send message and auto-create conversation if needed
export const sendMessageToUser = async (req: Request, res: Response) => {
    try {
        const { receiverId, text } = req.body;
        const senderId = req.user?._id;

        // Find or create conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        // Create message
        const message = await Message.create({
            conversation: conversation._id,
            senderId: senderId,
            message: text,
            receiverId: receiverId
        });

        // Update conversation
        conversation = await Conversation.findByIdAndUpdate(
            conversation._id,
            {
                lastMessage: message._id,
                updatedAt: new Date()
            },
            { new: true }
        )
        .populate({
            path: "participants",
            match: { _id: { $ne: senderId } },
            select: "-password"
        })

        const lastMessage = await Message.findById(conversation?.lastMessage);

        // Format conversation data
        const formattedConversation = ({
            conversationId: conversation!._id,
            lastMessage: lastMessage?.message,
            otherUser: conversation!.participants[0],
            updatedAt: conversation!.updatedAt
        });

        // Send socket event
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", message);
        }

        res.json({
            message: message,
            conversation: formattedConversation
        });

    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

// GET /conversations/check/:otherUserId - Check if conversation exists between two users
// GET /conversations/check/:otherUserId - Check if conversation exists between two users
export const checkConversationExists = async (req: Request, res: Response) => {
    try {
        const { otherUserId } = req.params;
        const currentUserId = req.user?._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [currentUserId, otherUserId] }
        })
        .populate({
            path: "participants",
            match: { _id: { $ne: currentUserId } },
            select: "-password"   // exclude password, include everything else
        })

        if (!conversation) {
            return res.json({
                exists: false,
                conversation: null
            });
        }

        const lastMessage = await Message.findById(conversation.lastMessage);

        const formattedConversation = {
            conversationId: conversation._id,
            lastMessage: lastMessage?.message,
            otherUser: conversation.participants[0],
            updatedAt: conversation.updatedAt
        };

        return res.json({
            exists: true,
            conversation: formattedConversation
        });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
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
