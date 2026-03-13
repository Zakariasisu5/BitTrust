"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  User,
  BookOpen,
  ShieldCheck,
  Activity,
  Settings,
  HelpCircle,
  Wallet,
  LogOut,
  ChevronDown
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Activity, label: "Activity", href: "/activity" },
  { icon: ShieldCheck, label: "Verification", href: "/verification" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const secondaryItems = [
  { icon: BookOpen, label: "Docs", href: "/docs" },
  { icon: HelpCircle, label: "Support", href: "/support" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { address, isConnected, isConnecting, connect, disconnect, network } = useWallet();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <aside className="fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] w-64 border-r border-slate-800 bg-[#020617]/90 backdrop-blur-md md:block">
      <div className="flex h-full flex-col justify-between px-3 py-6 relative">
        <div className="space-y-8">
          {/* Logo Section */}
          <div className="px-4 mb-2">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="BitTrust Logo"
                width={280}
                height={80}
                className="h-20 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Conditional Main Menu */}
          {isConnected && (
            <div>
              <h3 className="mb-2 px-4 text-[10px] font-mono font-bold text-amber-500">
                [MODULES::CORE]
              </h3>
              <div className="space-y-0.5 font-mono text-xs">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 transition-colors",
                        isActive
                          ? "text-amber-500 border-l-2 border-amber-500 bg-amber-500/5"
                          : "text-slate-400 hover:text-slate-200 border-l-2 border-transparent hover:border-slate-700",
                      )}
                    >
                      <span className="text-slate-600 opacity-50">├──</span>
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label.toUpperCase()}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Resources Menu */}
          <div>
            <h3 className="mb-2 px-4 text-[10px] font-mono font-bold text-slate-500">
              [MODULES::EXT]
            </h3>
            <div className="space-y-0.5 font-mono text-xs">
              {secondaryItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 transition-colors",
                      isActive
                        ? "text-amber-500 border-l-2 border-amber-500 bg-amber-500/5"
                        : "text-slate-400 hover:text-slate-200 border-l-2 border-transparent hover:border-slate-700",
                    )}
                  >
                    <span className="text-slate-600 opacity-50">├──</span>
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label.toUpperCase()}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Connection Block */}
        <div className="pt-4 border-t border-slate-800">
          <div className="mb-3 px-2 font-mono text-[10px] text-slate-500 flex justify-between items-center">
            <span>sys.node_v1.0</span>
            {isConnected && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>
          {isConnected ? (
            <div className="flex flex-col gap-3 px-2">
              <div className="flex items-center justify-between px-2 font-mono text-[10px]">
                <span className="text-slate-500">NET_ENV</span>
                <span className="text-amber-500 uppercase">{network}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-slate-700 bg-[#050816] hover:bg-slate-800 h-10 px-3 font-mono text-xs rounded-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Wallet className="h-3 w-3 text-emerald-500" />
                      <span>{truncateAddress(address!)}</span>
                    </div>
                    <ChevronDown className="h-3 w-3 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 border-slate-800 bg-[#050816] text-slate-200 rounded-sm font-mono text-xs"
                >
                  <DropdownMenuItem
                    onClick={disconnect}
                    className="text-red-400 focus:bg-red-950/30 focus:text-red-400 cursor-pointer mt-1 border-t border-slate-800 rounded-none"
                  >
                    <LogOut className="h-3 w-3 mr-2" /> DISCONNECT_AUTH
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="px-2">
              <Button
                onClick={connect}
                disabled={isConnecting}
                className="w-full primary-btn h-10 font-mono text-xs"
              >
                <Wallet className="h-3 w-3 mr-2" />
                {isConnecting ? "HANDSHAKE..." : "INIT_CONNECTION"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
