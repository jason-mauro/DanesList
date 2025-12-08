import React, { useState } from "react";
import { Sidebar } from "../Components/Sidebar";
import { ConversationList } from "../Components/ConversationList";
import { ConversationThread } from "../Components/ConversationThread";
import "../styles/Messages.css";
import { useLocation } from "react-router-dom";
import { useConversation } from "../context/ConversationContext";

export const NewMessage: React.FC = () => {
  const location = useLocation();
  const recepient = location.state?.user;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {setSelectedConversation} = useConversation();

  return (
    <div className="dl-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="dl-main messages-main">
        <div className="messages-container">
          <ConversationList
            onSelect={setSelectedConversation}
          />
          <ConversationThread newMessageTo={recepient} />

        </div>
      </main>
    </div>
  );
};
