"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
  refreshChats: () => void;
  setRefreshChats: (callback: () => void) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [refreshChats, setRefreshChats] = useState<() => void>(() => {
    // Default function that does nothing
    return () => {};
  });

  return (
    <ChatContext.Provider value={{ refreshChats, setRefreshChats }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
