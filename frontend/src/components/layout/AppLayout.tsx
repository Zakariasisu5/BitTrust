"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="relative min-h-screen bg-grid-slate-900">
      {/* Subtle top gradient applied globally */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#020617] via-transparent to-transparent z-0 pointer-events-none" />

      <div className="flex relative z-10">
        {!isHomePage && <Sidebar />}
        <main 
          className={cn(
            "flex-1 pt-4 md:pt-8 transition-all duration-300 ease-in-out min-h-screen",
            !isHomePage && "md:pl-64"
          )}
        >
          <div className={cn(
            "container mx-auto px-4 md:px-8",
            isHomePage && "max-w-7xl"
          )}>
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
};
