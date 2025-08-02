import Dexie from "dexie";
import type { Chat, Config, Message } from "../types";

class ChatDatabase extends Dexie {
  chats: Dexie.Table<Chat, number>;
  messages: Dexie.Table<Message, number>;
  config: Dexie.Table<Config, number>;

  constructor() {
    super("ChatDatabase");
    this.version(1).stores({
      chats: "++id, name, model, createdAt",
      messages: "++id, chatId, role, content, meta, context, createdAt",
      config: "++id, model, systemPrompt, createdAt",
    });

    this.chats = this.table("chats");
    this.messages = this.table("messages");
    this.config = this.table("config");
  }
}

export const db = new ChatDatabase();
