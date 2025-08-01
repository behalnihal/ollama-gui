"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSidebar } from "./ui/sidebar";
import { Github, Moon, Settings2, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export function Navbar() {
  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  return (
    <div className="container mx-auto flex justify-between items-center p-4">
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
      <div className="flex items-center gap-2 ">
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <Settings2 />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="cursor-pointer"
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
      </div>
    </div>
  );
}
