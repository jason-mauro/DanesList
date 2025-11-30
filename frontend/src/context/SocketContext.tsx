import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import type { ReactNode } from "react";
import { useConversation } from "./ConversationContext";

// Remove the socket.io-client import completely
// Add this script tag to your index.html instead:
// <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>

// Then use the global Socket object
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

type AppSocket = any; // Use 'any' for now with CDN version

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

    const authUser = localStorage.getItem("userId");

    useEffect(() => {
        if (!authUser || !window.io) return;

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