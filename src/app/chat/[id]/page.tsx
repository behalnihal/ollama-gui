"use client";

import { use } from "react";
import { Chat } from "@/components/chat/chat";
import { Navbar } from "@/components/navbar";

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <Chat key={id} chatId={id} />
      </div>
    </div>
  );
}
