"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export function Menu() {
  const { toggleSidebar } = useSidebar();
  const { setTheme } = useTheme();
  const [baseURL, setBaseURL] = useState("http://localhost:11434");
  const [systemPrompt, setSystemPrompt] = useState("");
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
              <SidebarMenu>
                {/* TODO: Fetch chats from local storage */}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="mb-5">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    tooltip="Settings"
                    className="cursor-pointer"
                  >
                    <div>
                      <Settings2 className="w-5 h-5" />
                      <span>Settings</span>
                      <ChevronUp className="ml-auto" />
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <Dialog>
                  <DropdownMenuContent className="w-63" align="center">
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
                      <DialogTrigger className="w-full text-left">
                        Configurations
                      </DialogTrigger>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Configurations</DialogTitle>
                      <DialogDescription>
                        Configure Ollama settings.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col space-y-2">
                      <Label>Base URL</Label>
                      <Input
                        type="text"
                        placeholder="Enter Base URL"
                        value={baseURL}
                        onChange={(e) => setBaseURL(e.target.value)}
                      />
                      <Label>System Prompt</Label>
                      <Textarea
                        placeholder="Enter System Prompt"
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                      />
                      <Button variant="outline">Delete all chats</Button>
                      <Button variant="outline" size="sm" className="w-full">
                        Save
                      </Button>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
