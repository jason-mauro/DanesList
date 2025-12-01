import React, { useState } from "react";
import { Sidebar } from "../Components/Sidebar";
import { ConversationList } from "../Components/ConversationList";
import { ConversationThread } from "../Components/ConversationThread";
import "../styles/Messages.css";
import { useConversation } from "../context/ConversationContext";
import LoadingSpinner from "../Components/LoadingSpinner";

export const Messages: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const {loading} = useConversation();

  return (
    <div className="dl-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      {loading ? <LoadingSpinner size="small"/> : 
      
      <main className="dl-main messages-main">
        <div className="messages-container">

          {/* LEFT COLUMN — LIST */}
          <ConversationList
            selected={selectedConversation}
            onSelect={setSelectedConversation}
          />

          {/* RIGHT COLUMN — THREAD */}
          <ConversationThread  />

        </div>
      </main>
    }
    </div>
  );
};
