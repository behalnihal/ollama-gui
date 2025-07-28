"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-2">
        <Link href="/"></Link>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          Toggle Theme
        </Button>
      </div>
    </div>
  );
}
