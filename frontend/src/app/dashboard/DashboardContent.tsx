"use client";

import { useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { useReputationScore } from "@/hooks/useContractRead";
import { ReputationCard } from "@/components/dashboard/ReputationCard";
import { LoanStatus } from "@/components/dashboard/LoanStatus";
import { ScoreChart } from "@/components/dashboard/ScoreChart";
import { FactorBreakdown } from "@/components/dashboard/FactorBreakdown";
import { ActivityTable } from "@/components/dashboard/ActivityTable";
import { CreditsCard } from "@/components/dashboard/CreditsCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, ArrowUpRight, AlertCircle } from "lucide-react";
import Link from "next/link";

export function DashboardContent() {
  const { isConnected, connect, address } = useWallet();
  const {
    displayScore,
    lastUpdated,
    txCount,
    isLoading: scoreLoading,
    error: scoreError,
  } = useReputationScore(address ?? null);
  const { toast } = useToast();

  const handleRefresh = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (scoreError) {
      toast({ title: "Error", description: scoreError, variant: "destructive" });
    }
  }, [scoreError, toast]);

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

  const isLoading = scoreLoading;

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
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
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
              score={displayScore} 
              lastUpdated={lastUpdated}
              isLoading={scoreLoading}
            />
            <LoanStatus 
              score={displayScore} 
              minScore={650} 
            />
            <CreditsCard address={address} />
            <div className="matte-card relative overflow-hidden shadow-2xl flex flex-col">
              <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-4 py-2 relative z-10">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[10px] text-slate-500">x402_listener</span>
              </div>
              <div className="p-4 font-mono text-[10px] sm:text-xs leading-relaxed text-slate-400 overflow-hidden relative z-10 flex-1 flex flex-col justify-end space-y-1.5">
                <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent pointer-events-none" />
                <p><span className="text-slate-500">{"["}SYS{"]"}</span> Port 4020 listening...</p>
                <p><span className="text-emerald-500">{"["}RECV{"]"}</span> GET /score/ST12... from AI_AGENT_04</p>
                <p><span className="text-amber-500">{"["}AUTH{"]"}</span> Enforcing 402 Payment...</p>
                <p><span className="text-emerald-500">{"["}PAID{"]"}</span> +0.01 USDCx received.</p>
                <p><span className="text-slate-500">{"["}SYS{"]"}</span> Session closed.</p>
                <p className="animate-pulse text-amber-500">_</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <ScoreChart currentScore={displayScore} />
            </div>
            <div>
              <FactorBreakdown txCount={txCount} />
            </div>
          </div>

          <ActivityTable />
        </>
      )}
    </div>
  );
}
