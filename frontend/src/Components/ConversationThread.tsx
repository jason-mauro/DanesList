import React from "react";

type ConversationThreadProps = {
  conversation: any;
};

export const ConversationThread: React.FC<ConversationThreadProps> = ({
  conversation,
}) => {
  if (!conversation) {
    return (
      <div className="messages-thread empty">
        Select conversation to view messages..
      </div>
    );
  }

  // TEMP MOCK MESSAGES
  const messages = [
    { from: "other", text: "Hey, is this still available?" },
    { from: "me", text: "Yes, it is!" },
    { from: "other", text: "Great, when can I pick it up?" },
  ];

  return (
    <div className="messages-thread">
      <h2 className="thread-name">{conversation.name}</h2>

      <div className="thread-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message-bubble ${msg.from === "me" ? "me" : "other"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="thread-input-row">
        <input className="thread-input" placeholder="Type a message..." />
        <button className="thread-send">Send</button>
      </div>
    </div>
  );
};
