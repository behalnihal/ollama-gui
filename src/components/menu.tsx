"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import Image from "next/image";
import { PenSquare } from "lucide-react";
import { ChatList } from "./chat/chat-list";
import { useRouter } from "next/navigation";

export function Menu() {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();

  const handleNewChat = () => {
    router.push("/");
  };

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-5">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Open Sidebar"
                    asChild
                    onClick={toggleSidebar}
                    className="cursor-pointer"
                  >
                    <div>
                      <Image
                        className="dark:invert"
                        src="/logo.png"
                        alt="Ollama Logo"
                        width={20}
                        height={20}
                      />
                      <span>Local LLaMA</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleNewChat}
                    tooltip="New Chat"
                    className="cursor-pointer"
                  >
                    <PenSquare />
                    <span>New Chat</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>
              <span>Chats</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <ChatList />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
