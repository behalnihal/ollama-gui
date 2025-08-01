export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  model: string;
}
