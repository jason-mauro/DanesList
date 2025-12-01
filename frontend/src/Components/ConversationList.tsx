import React, {useState, useEffect} from "react";
import type { ConversationData } from "../types/messages.types";
import { useConversation } from "../context/ConversationContext";
import axios from "axios";

type ConversationListProps = {
  selected?: ConversationData;
  onSelect: (c: any) => void;
};

export const ConversationList: React.FC<ConversationListProps> = () => {
  const {selectedConversation, setConversations, setSelectedConversation, conversations} = useConversation();


  const openConversation = async (conversation: ConversationData) => {
    // Mark as read
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/messages/conversations/${conversation.conversationId}/read`, {}, {withCredentials: true});

    // Clear unread count locally
    setConversations(prev => prev.map(conv => 
        conv.conversationId === conversation.conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
    ));

    setSelectedConversation(conversation);
};

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
            onClick={() => openConversation(c)}
            >
            <img className="messages-avatar" src={c.otherUser.avatar} />
            <div className="messages-info">
            <div className="messages-name">
              {c.otherUser.username}
              {c.unreadCount > 0 && (
                <span 
                  className={`unread-badge ${c.unreadCount > 99 ? 'max' : ''}`}
                  data-count={c.unreadCount}
                >
                  {c.unreadCount > 99 ? '99+' : c.unreadCount}
                </span>
              )}
            </div>
          
                {/* preview as bubble */}
                <div >
                {c.lastMessage}
                </div>
            </div>

            <div className="messages-time">{formatTime(c.updatedAt)}</div>
        </div>
      ))}
    </div>
  );
};
