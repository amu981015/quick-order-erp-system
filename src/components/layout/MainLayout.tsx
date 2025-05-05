
import React from "react";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

type MainLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className={cn("flex-1 ml-[70px] md:ml-[240px] p-6 transition-all", className)}>
        {children}
      </main>
      <Toaster />
    </div>
  );
}
