"use client";
import { ModelSelector } from "@/components/model-selector";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";

export default function Home() {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="container mx-auto p-2 flex justify-between items-center">
      <Button variant="ghost" onClick={toggleSidebar} className="md:hidden">
        <Image
          src="/logo.png"
          alt="sidebar-toggle"
          width={20}
          height={20}
          className="dark:invert"
        />
      </Button>
      <ModelSelector />
    </div>
  );
}
