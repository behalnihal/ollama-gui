import { Chat } from "@/components/chat/chat";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <Chat key="home" />
      </div>
    </div>
  );
}
