import { MessageInput } from "@/components/message-input";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex flex-col h-full justify-between">
      <Navbar />
      <MessageInput />
    </div>
  );
}
