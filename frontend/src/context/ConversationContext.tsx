import { createContext, useContext, useState} from "react";
import type {ReactNode } from "react";
import type { ConversationData, MessageData } from "../types/messages.types";

type ConversationContextType = {
  selectedConversation: ConversationData | null;
  setSelectedConversation: (conversation: ConversationData | null) => void;
  messages: MessageData[];
  setMessages: React.Dispatch<React.SetStateAction<MessageData[]>>;
};

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error("useConversation must be used within ConversationProvider");
  }
  return context;
};

export const ConversationProvider = ({ children }: { children: ReactNode }) => {
  const [selectedConversation, setSelectedConversation] = useState<ConversationData | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);

  return (
    <ConversationContext.Provider 
      value={{ selectedConversation, setSelectedConversation, messages, setMessages }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
