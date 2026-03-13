"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-800 bg-slate-950/50 backdrop-blur-sm transition-transform md:block">
      <div className="flex h-full flex-col justify-between px-3 py-6">
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
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Main Menu
              </h3>
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-amber-500/10 text-amber-500"
                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Resources Menu */}
          <div>
            <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Resources
            </h3>
            <div className="space-y-1">
              {secondaryItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-amber-500/10 text-amber-500"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* User Connection Block */}
        <div className="pt-4 border-t border-slate-800">
          <div className="mb-3 px-2 font-mono text-[10px] text-slate-500">
            v1.0.0-beta [sys.node]
          </div>
          {isConnected ? (
            <div className="flex flex-col gap-3 px-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-slate-500 font-medium">Network</span>
                <Badge variant="outline" className="border-amber-500/50 text-amber-500 bg-amber-500/10 text-[10px] py-0 h-5">
                  {network}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between border-slate-700 bg-slate-900/50 hover:bg-slate-800 h-10 px-3">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-mono">{truncateAddress(address!)}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 border-slate-800 bg-slate-900 text-slate-200">
                  <DropdownMenuItem
                    onClick={disconnect}
                    className="text-red-400 focus:bg-red-950/30 focus:text-red-400 cursor-pointer mt-1 border-t border-slate-800"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="px-2">
              <Button
                onClick={connect}
                disabled={isConnecting}
                className="w-full primary-btn h-10"
              >
                <Wallet className="h-4 w-4 mr-2" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
