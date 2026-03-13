"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="relative min-h-screen bg-grid-slate-900 overflow-hidden">
      {/* Global HUD Framing */}
      <div className="fixed inset-4 border border-slate-800/50 pointer-events-none z-50 hidden md:block">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500/30" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500/30" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500/30" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500/30" />
        
        {/* HUD Metadata */}
        <div className="absolute -top-3 left-8 bg-[#020617] px-2 font-mono text-[9px] text-slate-500 tracking-widest">
          SYS_HUD_ACTIVE // STACKS_L2
        </div>
        <div className="absolute -bottom-3 right-8 bg-[#020617] px-2 font-mono text-[9px] text-slate-500 tracking-widest">
          V_1.0.0-BETA // NODE_SECURE
        </div>
      </div>

      {/* Subtle top gradient applied globally */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#020617] via-transparent to-transparent z-0 pointer-events-none" />

      <div className="flex relative z-10 min-h-screen md:p-4">
        {!isHomePage && <Sidebar />}
        <main 
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out min-h-screen",
            !isHomePage ? "md:pl-64 pt-4 md:pt-8" : ""
          )}
        >
          <div className={cn(
            "container mx-auto px-4 md:px-8",
            !isHomePage && "max-w-7xl"
          )}>
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
};
