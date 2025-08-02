export type ChatRole = "assistant" | "user";

export interface Config {
  id?: number;
  model: string;
  systemPrompt: string;
  createdAt: Date;
}

export interface Chat {
  id?: number;
  name: string;
  model: string;
  createdAt: Date;
}

export interface Message {
  id?: number;
  chatId: number;
  role: ChatRole;
  content: string;
  meta?: any;
  context?: number[];
  createdAt: Date;
}

export interface Model {
  name: string;
  modified_at: string;
  size: number;
}
