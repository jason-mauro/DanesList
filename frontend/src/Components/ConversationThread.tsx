import React, {useState, useEffect} from "react";
import type { User } from "../types/user.type";
import { useConversation } from "../context/ConversationContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type ConversationThreadProps = {
  newMessageTo?: User
};

export const ConversationThread: React.FC<ConversationThreadProps> = ({
  newMessageTo
}) => {
  const navigate = useNavigate();
  const {messages, setMessages, setSelectedConversation, selectedConversation} = useConversation();
  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  const sendMessage = async() => {
      try {
        if (messageContent === "") return;
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/messages/`, {receiverId: selectedConversation ? selectedConversation.otherUser._id : newMessageTo?._id, text: messageContent}, {withCredentials: true});
        const data = response.data;
        const newMessage = data.message;
        setSelectedConversation(data.conversation);
        setMessages(prev => [...prev, newMessage]);
        setMessageContent("")
        if (newMessageTo){
          navigate("/messages");
        }
      } catch (error: any) {
        console.log(error);
      }
  }

  useEffect(() => {
    const fetchData = async() => {
      if (!selectedConversation) return;
      try {
        console.log(`${import.meta.env.VITE_API_URL}/messages/${selectedConversation?.conversationId}/messages`)
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages/${selectedConversation?.conversationId}/messages`, {withCredentials: true});
        const data = response.data;
        setMessages(data);
      } catch (error: any){
        console.log(error);
      }
    }
    fetchData();
  }, [selectedConversation])


  return (
    <div className="messages-thread">
      {selectedConversation || newMessageTo ?  
      <>
      <h2 className="thread-name">{selectedConversation ? selectedConversation.otherUser.username : `Message: ${newMessageTo?.username}`}</h2>
          <div className="thread-messages">
            {messages?.map((msg, i) => (
              <div
                key={i}
                className={`message-bubble ${msg.senderId === localStorage.getItem("userId") ? "me" : "other"}`}
              >
                {msg.message}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="thread-input-row">
          <input
              className="thread-input"
              placeholder="Type a message..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button className="thread-send" onClick={sendMessage} >Send</button>
          </div> 
          </>: <div className="no-selection">
        Select a conversation to view
      </div> }
    </div>
  );
};
