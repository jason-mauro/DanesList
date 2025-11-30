import { createContext, useContext, useState, useEffect} from "react";
import type {ReactNode } from "react";
import type { ConversationData, MessageData } from "../types/messages.types";
import { useSocketContext } from "./SocketContext"; // Import your socket context
import axios from "axios";

type ConversationContextType = {
  selectedConversation: ConversationData | null;
  setSelectedConversation: (conversation: ConversationData | null) => void;
  messages: MessageData[];
  setMessages: React.Dispatch<React.SetStateAction<MessageData[]>>;
  conversations: ConversationData[];
  setConversations: React.Dispatch<React.SetStateAction<ConversationData[]>>;
  markConversationAsRead: (conversationId: string) => Promise<void>;
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
};

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error("useConversation must be used within ConversationProvider");
  }
  return context;
};

export const ConversationProvider = ({ children }: { children: ReactNode }) => {
    const [selectedConversation, setSelectedConversation] = useState<ConversationData | null>(null);
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [conversations, setConversations] = useState<ConversationData[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    
    const { socket } = useSocketContext();

    // Listen for new messages via socket
    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (data: {
            conversationId: string;
            message: string;
            sender: string;
            createdAt: string;
        }) => {
            // If message is for the currently open conversation, add it to messages
            if (selectedConversation?.conversationId === data.conversationId) {
                const newMessage: MessageData = {
                    _id: Date.now().toString(), // Temp ID
                    conversationId: data.conversationId,
                    senderId: data.sender,
                    message: data.message,
                    createdAt: data.createdAt,
                    updatedAt: data.createdAt,
                    receiverId: localStorage.getItem("userId") || "",
                    read: false
                };
                setMessages(prev => [...prev, newMessage]);
            } else {
                // Message is for a different conversation - increment unread count
                setConversations(prev => prev.map(conv => 
                    conv.conversationId === data.conversationId
                        ? { 
                            ...conv, 
                            unreadCount: (conv.unreadCount || 0) + 1,
                            lastMessage: data.message,
                            updatedAt: data.createdAt
                          }
                        : conv
                ));
                setUnreadCount(prev => prev + 1);
            }
        };

        socket.on("newMessage", handleNewMessage);
        

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [socket, selectedConversation]);

    useEffect(() => {

        const fetchData = async () => {
          try {
              const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages/conversations`, {withCredentials: true});
              const data = response.data;
              setConversations(data);
              console.log(data)
              setUnreadCount(
                data.reduce((acc: number, e:ConversationData) => acc + e.unreadCount, 0)
              );
          } catch (error: any){
            console.log(error.message);
          }
        }
        fetchData();
      }, []);

    // Mark conversation as read
    const markConversationAsRead = async (conversationId: string) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/messages/conversations/${conversationId}/read`, {}, {withCredentials:true});

            // Clear unread count locally
            setConversations(prev => prev.map(conv => 
                conv.conversationId === conversationId
                    ? { ...conv, unreadCount: 0 }
                    : conv
            ));
            const unreadCount = conversations.reduce(
                (acc, conv) => acc + (conv.unreadCount || 0),
                0
              );
            setUnreadCount(unreadCount);
        } catch (error) {
            console.error("Failed to mark conversation as read:", error);
        }
    };

    // Auto-mark as read when selecting a conversation
    useEffect(() => {
        if (selectedConversation?.conversationId) {
            markConversationAsRead(selectedConversation.conversationId);
        }
    }, [selectedConversation?.conversationId]);

    return (
        <ConversationContext.Provider 
            value={{ 
                selectedConversation, 
                setSelectedConversation, 
                messages, 
                setMessages,
                conversations,
                setConversations,
                markConversationAsRead,
                unreadCount,
                setUnreadCount
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
};