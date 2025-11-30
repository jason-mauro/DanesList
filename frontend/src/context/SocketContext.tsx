// import { createContext, useState, useEffect, useContext } from "react";
// import type { ReactNode } from "react";


// // Define Socket type manually
// type Socket = ReturnType<typeof io>;

// // Correct context type
// type SocketContextType = {
//   socket: Socket | null;
//   onlineUsers: string[];
// };

// const SocketContext = createContext<SocketContextType>({
//   socket: null,
//   onlineUsers: [],
// });

// export const useSocketContext = () => useContext(SocketContext);

// interface SocketProviderProps {
//   children: ReactNode;
// }

// export const SocketContextProvider = ({ children }: SocketProviderProps) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

//   const authUser = localStorage.getItem("userId");

//   useEffect(() => {
//     if (authUser) {
//       const newSocket = io("http://localhost:9000", {
//         query: { userId: authUser },
//       });

//       setSocket(newSocket);

//       newSocket.on("getOnlineUsers", (users: string[]) => {
//         setOnlineUsers(users);
//       });

//       return () => {
//         newSocket.disconnect();
//         setSocket(null);
//       };
//     } else {
//       if (socket) {
//         socket.disconnect();
//         setSocket(null);
//       }
//     }
//   }, [authUser]);

//   return (
//     <SocketContext.Provider value={{ socket, onlineUsers }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };