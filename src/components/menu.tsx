"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import Image from "next/image";
import {
  ChevronUp,
  Laptop,
  Moon,
  PenSquare,
  Settings2,
  Sun,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

export function Menu() {
  const { toggleSidebar } = useSidebar();
  const { setTheme } = useTheme();
  const handleNewChat = () => {
    // TODO: Implement new chat
    console.log("new chat");
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
                  <SidebarMenuButton onClick={handleNewChat} tooltip="New Chat">
                    <PenSquare />
                    <span>New Chat</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="mb-5">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton asChild tooltip="Settings">
                    <div>
                      <Settings2 className="w-5 h-5" />
                      <span>Settings</span>
                      <ChevronUp className="ml-auto" />
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-63">
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <span>Theme</span>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <div className="flex flex-col space-y-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => setTheme("dark")}
                            >
                              <Moon className="mr-1" /> Dark
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => setTheme("light")}
                            >
                              <Sun className="mr-1" /> Light
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => setTheme("system")}
                            >
                              <Laptop className="mr-1" /> System
                            </Button>
                          </div>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSubTrigger>
                  </DropdownMenuSub>
                  <DropdownMenuItem>
                    <span>Configurations</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
