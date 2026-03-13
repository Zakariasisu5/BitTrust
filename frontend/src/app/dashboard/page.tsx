"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { ReputationCard } from "@/components/dashboard/ReputationCard";
import { LoanStatus } from "@/components/dashboard/LoanStatus";
import { ScoreChart } from "@/components/dashboard/ScoreChart";
import { FactorBreakdown } from "@/components/dashboard/FactorBreakdown";
import { ActivityTable } from "@/components/dashboard/ActivityTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, ArrowUpRight, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { isConnected, connect, address } = useWallet();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 rounded-full bg-slate-900 p-6 border border-slate-800">
          <AlertCircle className="h-12 w-12 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold">Wallet Disconnected</h1>
        <p className="mt-2 text-slate-400">Please connect your Stacks wallet to view your reputation dashboard.</p>
        <Button onClick={connect} className="primary-btn mt-6">
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-500">Monitoring reputation for {address?.slice(0, 12)}...</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="secondary-btn h-9 border-slate-800"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button asChild size="sm" className="primary-btn h-9">
            <Link href="/profile">
              View Profile <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[180px] rounded-xl bg-slate-900/50" />
          <Skeleton className="h-[180px] rounded-xl bg-slate-900/50" />
          <Skeleton className="h-[180px] rounded-xl bg-slate-900/50" />
          <Skeleton className="h-[400px] rounded-xl bg-slate-900/50 md:col-span-2" />
          <Skeleton className="h-[400px] rounded-xl bg-slate-900/50" />
          <Skeleton className="h-[300px] rounded-xl bg-slate-900/50 lg:col-span-3" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ReputationCard 
              score={732} 
              tier="A" 
              label="Trusted / Low Risk" 
              lastUpdated="2 mins ago" 
            />
            <LoanStatus 
              score={732} 
              minScore={650} 
            />
            <div className="matte-card flex flex-col items-center justify-center p-6 text-center">
              <p className="text-sm font-medium text-slate-400">Active Verification</p>
              <div className="mt-2 text-2xl font-bold text-amber-500 tracking-tighter">x402 Protocol</div>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed px-4">
                Agents are currently paying 0.01 USDCx per query to verify your reputation.
              </p>
              <Button variant="link" className="mt-2 text-xs text-amber-500/80">
                View Earnings History
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <ScoreChart />
            </div>
            <div>
              <FactorBreakdown />
            </div>
          </div>

          <ActivityTable />
        </>
      )}
    </div>
  );
}
