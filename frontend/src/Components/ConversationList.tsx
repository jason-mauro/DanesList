import React from "react";

type ConversationListProps = {
  selected: any;
  onSelect: (c: any) => void;
};

const mockConversations = [
  { id: 1, name: "Linda", preview: "Yes the item is still ...", time: "10 min" },
  { id: 2, name: "User2", preview: "Supporting line text lorem…", time: "1 day ago" },
  { id: 3, name: "User3", preview: "Supporting line text lorem…", time: "1 day ago" },
];

export const ConversationList: React.FC<ConversationListProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div className="messages-list">
      <h2 className="messages-title">Conversations</h2>

      {mockConversations.map((c) => (
        <div
            key={c.id}
            className={`messages-item ${selected && selected.id === c.id ? "active" : ""}`}
            onClick={() => onSelect(c)}
            >
            <div className="messages-avatar" />

            <div className="messages-info">
                <div className="messages-name">{c.name}</div>

                {/* preview as bubble */}
                <div className="messages-preview-bubble">
                {c.preview}
                </div>
            </div>

            <div className="messages-time">{c.time}</div>
        </div>
      ))}
    </div>
  );
};
