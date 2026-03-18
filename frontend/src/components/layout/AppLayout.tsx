"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  LayoutDashboard,
  User,
  Trophy,
  Activity,
  ShieldCheck,
  Settings,
  BookOpen,
  HelpCircle,
  Wallet,
  LogOut,
} from "lucide-react";

const mobileMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  { icon: Activity, label: "Activity", href: "/activity" },
  { icon: ShieldCheck, label: "Verification", href: "/verification" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: BookOpen, label: "Docs", href: "/docs" },
  { icon: HelpCircle, label: "Support", href: "/support" },
];

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();

  return (
    <div className="relative min-h-screen bg-grid-slate-900 overflow-hidden">
      {/* Global HUD Framing */}
      <div className="fixed inset-4 border border-slate-800/50 pointer-events-none z-50 hidden md:block">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500/30" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500/30" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500/30" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500/30" />
        <div className="absolute -top-3 left-8 bg-[#020617] px-2 font-mono text-[9px] text-slate-500 tracking-widest">
          SYS_HUD_ACTIVE // STACKS_L2
        </div>
        <div className="absolute -bottom-3 right-8 bg-[#020617] px-2 font-mono text-[9px] text-slate-500 tracking-widest">
          V_1.0.0-BETA // NODE_SECURE
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#020617] via-transparent to-transparent z-0 pointer-events-none" />

      {/* Mobile top bar */}
      {!isHomePage && (
        <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-[#020617]/95 backdrop-blur-md border-b border-slate-800 md:hidden">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <Image src="/logo.png" alt="BitTrust" width={100} height={28} className="h-7 w-auto" />
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="text-slate-400 hover:text-amber-500 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      )}

      {/* Mobile drawer */}
      {!isHomePage && mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <nav className="absolute top-0 left-0 bottom-0 w-64 bg-[#020617] border-r border-slate-800 flex flex-col pt-16 pb-6 px-3 overflow-y-auto">
            <p className="px-4 mb-2 text-[10px] font-mono font-bold text-amber-500">[MODULES::CORE]</p>
            <div className="space-y-0.5 font-mono text-xs flex-1">
              {mobileMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 transition-colors border-l-2",
                    pathname === item.href
                      ? "text-amber-500 border-amber-500 bg-amber-500/5"
                      : "text-slate-400 hover:text-slate-200 border-transparent hover:border-slate-700"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label.toUpperCase()}
                </Link>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-800 px-2">
              {isConnected ? (
                <div className="space-y-2">
                  <p className="text-[10px] font-mono text-slate-500 px-2 truncate">{address}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-red-900/50 text-red-400 hover:bg-red-950/30 font-mono text-xs"
                    onClick={() => { disconnect(); setMobileOpen(false); }}
                  >
                    <LogOut className="h-3 w-3 mr-2" /> DISCONNECT
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  className="primary-btn w-full font-mono text-xs"
                  onClick={() => { connect(); setMobileOpen(false); }}
                  disabled={isConnecting}
                >
                  <Wallet className="h-3 w-3 mr-2" />
                  {isConnecting ? "CONNECTING..." : "CONNECT WALLET"}
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}

      <div className="flex relative z-10 min-h-screen md:p-4">
        {!isHomePage && <Sidebar />}
        <main
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out min-h-screen",
            !isHomePage ? "md:pl-64 pt-16 md:pt-8" : ""
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
