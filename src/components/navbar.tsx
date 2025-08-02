"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSidebar } from "./ui/sidebar";
import { Github, Moon, Settings2, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { db } from "@/db/db";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
export function Navbar() {
  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [baseURL, setBaseURL] = useState("http://localhost:11434");
  const [systemPrompt, setSystemPrompt] = useState("");

  const handleSave = () => {
    db.config.put({
      model: baseURL,
      systemPrompt: systemPrompt,
      createdAt: new Date(),
    });
  };
  return (
    <div className="container mx-auto flex justify-between items-center p-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={toggleSidebar} className="md:hidden">
          <Image
            src="/logo.png"
            alt="sidebar-toggle"
            width={20}
            height={20}
            className="dark:invert"
          />
        </Button>
        <Link href="https://github.com/behalnihal/ollama-gui" target="_blank">
          <Button
            variant="ghost"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Github />
          </Button>
        </Link>
      </div>
      <div className="flex items-center gap-2 ">
        <Dialog>
          <DialogTrigger>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="ghost" size="icon" className="cursor-pointer">
                  <Settings2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Configurations</DialogTitle>
              <DialogDescription>Configure Ollama settings.</DialogDescription>
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
                className="resize-none"
                placeholder="Enter System Prompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
              />
              <Button onClick={handleSave}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="cursor-pointer"
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Theme</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
