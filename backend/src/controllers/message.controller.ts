import {Request, Response} from "express";
import Conversation from "../models/conversations.model.js";
import Message from "../models/messages.model.js";
import  { getReceiverSocketId } from "../socket/socket.js"
import {io} from "../index.js";
import { format } from "path";

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

        // Get unread counts for each conversation
        const conversationsWithUnread = await Promise.all(
            conversations.map(async (conv) => {
                const unreadCount = await Message.countDocuments({
                    conversationId: conv._id,
                    receiverId: userID,
                    read: false
                });

                const lastMessage = await Message.findById(conv.lastMessage);
                return {
                    conversationId: conv._id,
                    otherUser: conv.participants[0],
                    lastMessage: lastMessage?.message,
                    updatedAt: conv.updatedAt,
                    unreadCount // Add unread count
                };
            })
        );

        return res.status(200).json(conversationsWithUnread);

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};


// GET /conversations/:id/messages?limit=20&page=1
export const getConversationMessages = async (req: Request, res: Response) => {
    try {
      const { id} = req.params;
    
      const messages = await Message.find({ conversationId: id})
        .sort({ createdAt: -1 });
  
      return res.status(200).json(messages.reverse()); // oldest → newest

  
    } catch (err: any) {
      return res.status(500).json({ error : err.message });
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
            conversationId: conversation._id,
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
            io.to(receiverSocketId).emit("newMessage", {
                conversationId: conversation?._id.toString() || "",
                message: message.message,
                sender: senderId?.toString() || "", 
                createdAt: conversation?.updatedAt.toString() || ""
            });
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

export const markConversationAsRead = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user?._id;

        // Mark all messages in this conversation as read where user is receiver
        await Message.updateMany(
            {
                conversationId: conversationId,
                receiverId: userId,
                read: false
            },
            {
                read: true,

            }
        );

        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
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
            conversationId: conversationId,
            senderId: req.user?._id,
            message: text,
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
            io.to(receiverSocketId).emit("newMessage", {
                conversationId: conversation?._id.toString() || "",
                message: message.message,
                sender: senderId || "", 
                createdAt: conversation?.updatedAt.toString() || ""
            });
        }

        res.json(populated);
    } catch (error: any){
        res.status(500).json({error: error.message})
    }
}
