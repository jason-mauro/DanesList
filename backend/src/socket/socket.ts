// socket.ts
import { Server, Socket } from "socket.io";
import http from "http";

interface ServerToClientEvents {
    newMessage: (data: {
        conversationId: string;
        message: string;
        sender: string;
        createdAt: string;
    }) => void;

    getOnlineUsers: (users: string[]) => void;
}

interface ClientToServerEvents {}

interface InterServerEvents {}

interface SocketData {
    userId?: string;
}

const userSocketMap: Record<string, string> = {};

export const getReceiverSocketId = (userId: string): string | undefined => {
    return userSocketMap[userId];
};


export const setupSocket = (server: http.Server) => {
    const io = new Server<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
    >(server, {
        cors: {
            origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://0.0.0.0:5173"],
            credentials: true,
        },
    });

    io.on("connection", (socket: Socket) => {
        const userId = socket.handshake.query.userId as string;

        if (userId) {
            userSocketMap[userId] = socket.id;
            socket.data.userId = userId;
        }

        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on("disconnect", () => {
            if (userId) {
                delete userSocketMap[userId];
            }
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    });

    return io;
};
