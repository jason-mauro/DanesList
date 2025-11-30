import React, {useState, useEffect} from "react";
import type { ConversationData } from "../types/messages.types";
import { useConversation } from "../context/ConversationContext";
import axios from "axios";

type ConversationListProps = {
  selected?: ConversationData;
  onSelect: (c: any) => void;
};

export const ConversationList: React.FC<ConversationListProps> = () => {
  const {selectedConversation, setSelectedConversation} = useConversation();
  const [conversations, setConverstaions] = useState<ConversationData[]>([]);

  useEffect(() => {

    const fetchData = async () => {
      try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages/conversations`, {withCredentials: true});
          const data = response.data;
          console.log(data);
          setConverstaions(data);
      } catch (error: any){
        console.log(error.message);
      }
    }
    fetchData();
  }, []);

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      // Show time if today
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      // Show "Yesterday" if yesterday
      return "Yesterday";
    } else {
      // Show date if older
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="messages-list">
      <h2 className="messages-title">Conversations</h2>

      {conversations?.map((c) => (
        <div
            key={c.conversationId}
            className={`messages-item ${selectedConversation && selectedConversation.conversationId=== c.conversationId ? "active" : ""}`}
            onClick={() => setSelectedConversation(c)}
            >
            <img className="messages-avatar" src={c.otherUser.avatar} />
            <div className="messages-info">
                <div className="messages-name">{c.otherUser.username}</div>

                {/* preview as bubble */}
                <div className="messages-preview-bubble">
                {c.lastMessage}
                </div>
            </div>

            <div className="messages-time">{formatTime(c.updatedAt)}</div>
        </div>
      ))}
    </div>
  );
};
