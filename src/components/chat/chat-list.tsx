"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Trash2 } from "lucide-react";
import { db } from "@/db/db";
import { useRouter, usePathname } from "next/navigation";
import { Chat } from "@/types";
import { useChatContext } from "./chat-context";
import { useSidebar } from "@/components/ui/sidebar";

export function ChatList() {
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const { setRefreshChats } = useChatContext();
  const { state } = useSidebar();

  const loadChats = async () => {
    try {
      const allChats = await db.chats.orderBy("createdAt").reverse().toArray();
      setChats(allChats);
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };

  useEffect(() => {
    loadChats();
    setRefreshChats(loadChats);
  }, [setRefreshChats]);

  const deleteChat = async (chatId: number) => {
    try {
      // Delete all messages for this chat
      await db.messages.where("chatId").equals(chatId).delete();
      // Delete the chat
      await db.chats.delete(chatId);
      // Reload chats
      loadChats();

      // If we're currently on this chat, redirect to home
      if (pathname === `/chat/${chatId}`) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {state === "collapsed" ? (
          <></>
        ) : chats.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No chats yet
          </div>
        ) : (
          <div className="space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer ${
                  pathname === `/chat/${chat.id}` ? "bg-muted" : ""
                }`}
                onClick={() => router.push(`/chat/${chat.id}`)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{chat.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(chat.createdAt)}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id!);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
