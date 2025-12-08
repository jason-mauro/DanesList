import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import type { ReactNode } from "react";
import { useConversation } from "./ConversationContext";

declare global {
    interface Window {
        io: any;
    }
}

interface ServerToClientEvents {
    newMessage: (data: {
        conversationId: string;
        message: string;
        sender: string;
        createdAt: string;
    }) => void;

    getOnlineUsers: (users: string[]) => void;
}

type AppSocket = any;

interface SocketContextValue {
    socket: AppSocket | null;
    onlineUsers: string[];
}

const SocketContext = createContext<SocketContextValue>({
    socket: null,
    onlineUsers: [],
});

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<AppSocket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [authUser, setAuthUser] = useState<string | null>(
        localStorage.getItem("userId")
    );

    useEffect(() => {
        const handleStorageChange = () => {
            setAuthUser(localStorage.getItem("userId"));
        };

        window.addEventListener("storage", handleStorageChange);
        
        const interval = setInterval(() => {
            const currentUserId = localStorage.getItem("userId");
            if (currentUserId !== authUser) {
                setAuthUser(currentUserId);
            }
        }, 1000);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
    }, [authUser]);

    useEffect(() => {
        if (!authUser || !window.io) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const newSocket = window.io("http://localhost:9000", {
            query: { userId: authUser },
            withCredentials: true,
        });

        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (users: string[]) => setOnlineUsers(users));

        return () => newSocket.disconnect();
    }, [authUser]);
    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};