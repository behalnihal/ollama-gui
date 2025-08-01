"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSidebar } from "./ui/sidebar";

export function Navbar() {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="container mx-auto flex justify-between items-center">
      <Button variant="ghost" onClick={toggleSidebar} className="md:hidden">
        <Image
          src="/logo.png"
          alt="sidebar-toggle"
          width={20}
          height={20}
          className="dark:invert"
        />
      </Button>
    </div>
  );
}
