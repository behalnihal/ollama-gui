"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import { MoonIcon, SunIcon } from "lucide-react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="border-b container mx-auto flex justify-between items-center p-4">
      <div className="flex items-center gap-2">
        <Link className="flex items-center gap-2" href="/">
          <Image src="/logo.png" alt="Ollama Logo" width={32} height={32} />
          <span className="text-2xl text-sky-600 font-light">Local LLaMA</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="cursor-pointer transition-all duration-300 hover:bg-transparent"
          variant="outline"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <SunIcon className="w-4 h-4" />
          ) : (
            <MoonIcon className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
