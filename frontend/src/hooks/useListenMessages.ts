// import { useEffect } from "react";

// import { useSocketContext } from "../context/SocketContext";
// import {useConversation } from "../context/ConversationContext";
// import type { MessageData } from "../types/messages.types";
// const useListenMessages = () => {
// 	const { socket } = useSocketContext();
// 	const { messages, setMessages } = useConversation();

// 	useEffect(() => {
// 		socket?.on("newMessage", (newMessage: MessageData) => {
//             const sound = new Audio();
//             sound.play().catch((error) => { console.error("error while playing sound")})
// 			setMessages([...messages, newMessage]);
// 		});

// 		() => socket?.off("newMessage");
// 	}, [socket, setMessages]);
// };
// export default useListenMessages;