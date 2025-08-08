"use client";

import { useEffect, useState } from "react";
// Removed Button to avoid nested button issues inside sidebar
import { MessageSquare, Trash2 } from "lucide-react";
import { db } from "@/db/db";
import { useRouter, usePathname } from "next/navigation";
import { Chat } from "@/types";
import { useChatContext } from "./chat-context";
import { useSidebar } from "@/components/ui/sidebar";
import { liveQuery } from "dexie";

export function ChatList() {
  const router = useRouter();
  const pathname = usePathname();
  const { setRefreshChats } = useChatContext();
  const { state } = useSidebar();
  const [chats, setChats] = useState<Chat[]>([]);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    const subscription = liveQuery(() =>
      db.chats.orderBy("createdAt").reverse().toArray()
    ).subscribe({
      next: (rows) => setChats(rows as Chat[]),
      error: (err) => console.error("Error in liveQuery(chats):", err),
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Expose a manual refresh function that triggers an immediate fetch
    setRefreshChats(() => async () => {
      const rows = await db.chats.orderBy("createdAt").reverse().toArray();
      setChats(rows as Chat[]);
      setBump((n) => n + 1);
    });
  }, [setRefreshChats]);

  const deleteChat = async (chatId: number) => {
    try {
      // Delete all messages for this chat
      await db.messages.where("chatId").equals(chatId).delete();
      // Delete the chat
      await db.chats.delete(chatId);
      // No manual reload needed; useLiveQuery will update automatically

      // If we're currently on this chat, redirect to home
      if (pathname === `/chat/${chatId}`) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
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
                className={`group flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer ${
                  pathname === `/chat/${chat.id}` ? "bg-muted" : ""
                }`}
                onClick={() => router.push(`/chat/${chat.id}`)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{chat.name}</div>
                  </div>
                </div>
                <div
                  role="button"
                  aria-label="Delete chat"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded hover:bg-muted/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id!);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
