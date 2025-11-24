import React, { useState } from "react";
import { Sidebar } from "../Components/Sidebar";
import { ConversationList } from "../Components/ConversationList";
import { ConversationThread } from "../Components/ConversationThread";
import "../styles/Messages.css";

export const Messages: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  return (
    <div className="dl-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="dl-main messages-main">
        <div className="messages-container">

          {/* LEFT COLUMN — LIST */}
          <ConversationList
            selected={selectedConversation}
            onSelect={setSelectedConversation}
          />

          {/* RIGHT COLUMN — THREAD */}
          <ConversationThread conversation={selectedConversation} />

        </div>
      </main>
    </div>
  );
};
