import { createContext, useContext, useState, useEffect} from "react";
import type {ReactNode } from "react";
import type { ConversationData, MessageData } from "../types/messages.types";
import { useSocketContext } from "./SocketContext";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

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
  loading: boolean
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
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    
    const { socket } = useSocketContext();

    useEffect(() => {
        setSelectedConversation(null);
        setMessages([]);
        setConversations([]);
        setUnreadCount(0);
        setLoading(true);
      }, [user?._id]);

    useEffect(() => {
        if (!user?._id) return;
    
        const fetchData = async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/messages/conversations`,
              { withCredentials: true }
            );
    
            const data = response.data;
            setConversations(data);
            const unreadCount = conversations.reduce( (acc, conv) => acc + (conv.unreadCount || 0), 0 ); 
            setUnreadCount(unreadCount);

          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [user, selectedConversation]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (data: {
            conversationId: string;
            message: string;
            sender: string;
            createdAt: string;
        }) => {
            if (selectedConversation?.conversationId === data.conversationId) {
                const newMessage: MessageData = {
                    _id: Date.now().toString(),
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

    const markConversationAsRead = async (conversationId: string) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/messages/conversations/${conversationId}/read`, {}, {withCredentials:true});

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
                setUnreadCount,
                loading
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
};