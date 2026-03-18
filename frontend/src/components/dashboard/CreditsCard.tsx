"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useCreditsBalance, useUsdcBalance } from "@/hooks/useContractRead";
import { buyCredits } from "@/lib/contract-calls";
import { userSession } from "@/context/WalletContext";
import { QUERY_PRICE } from "@/lib/contracts";
import { Coins, Loader2, Zap, AlertCircle } from "lucide-react";
import Link from "next/link";

interface CreditsCardProps {
  address: string | null;
  onSuccess?: () => void;
}

export const CreditsCard = ({ address, onSuccess }: CreditsCardProps) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);
  const { balance, isLoading, error } = useCreditsBalance(address, refreshKey);
  const { displayBalance: usdcBalance, isLoading: usdcLoading } = useUsdcBalance(address, refreshKey);
  const [isBuying, setIsBuying] = useState(false);
  const { toast } = useToast();

  const handleBuyCredits = (amount: string, label: string) => {
    if (!address) return;
    setIsBuying(true);
    buyCredits(
      amount,
      userSession,
      (data) => {
        setIsBuying(false);
        toast({
          title: "Credits Purchased",
          description: `${label} added. Tx: ${data.txId?.slice(0, 8)}...`,
        });
        onSuccess?.();
        refresh();
      },
      () => {
        setIsBuying(false);
        toast({
          title: "Cancelled",
          description: "Transaction was cancelled.",
          variant: "destructive",
        });
      }
    );
  };

  if (!address) return null;

  if (isLoading) {
    return (
      <Card className="matte-card">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32 bg-slate-800" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-20 bg-slate-800" />
          <Skeleton className="h-8 w-full bg-slate-800" />
        </CardContent>
      </Card>
    );
  }

  const hasUsdc = usdcBalance >= 1;
  const buyDisabled = isBuying || !hasUsdc || usdcLoading;
  // Each credit = 1 API query. Show projected queries remaining.
  const projectedQueries = balance;

  return (
    <Card className="matte-card relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-slate-400 font-mono flex items-center gap-2">
          <Coins className="h-4 w-4 text-amber-500" />
          [API_CREDITS_x402]
        </CardTitle>
        {error && (
          <span className="text-[10px] text-red-500 font-mono flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> CONTRACT_ERR
          </span>
        )}
      </CardHeader>
      <CardContent className="relative z-10 space-y-4">
        {/* Credit balance */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold text-amber-500 font-mono">{balance}</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              x402 API credits on-chain
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono text-slate-400">
              {usdcLoading ? "..." : usdcBalance.toFixed(2)}
            </p>
            <p className="text-[10px] text-slate-600 font-mono">USDCx balance</p>
          </div>
        </div>

        {/* Projected queries */}
        <div className="rounded border border-slate-800 bg-slate-950/50 px-3 py-2 font-mono text-[10px] space-y-1">
          <div className="flex justify-between text-slate-500">
            <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-amber-500/60" /> PROJECTED_QUERIES</span>
            <span className={projectedQueries > 0 ? "text-emerald-400" : "text-red-400"}>
              {projectedQueries} remaining
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>PRICE_PER_QUERY</span>
            <span>1 USDCx</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>PROTOCOL</span>
            <span>x402 / Stacks L2</span>
          </div>
        </div>

        {/* Buy buttons */}
        <div className="space-y-2">
          <Button
            size="sm"
            className="primary-btn w-full font-mono text-xs"
            disabled={buyDisabled}
            onClick={() => handleBuyCredits(String(QUERY_PRICE), "1 credit")}
          >
            {isBuying ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
            Buy 1 Credit (1 USDCx)
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="secondary-btn w-full font-mono text-xs border-slate-700"
            disabled={buyDisabled}
            onClick={() => handleBuyCredits(String(QUERY_PRICE * 10), "10 credits")}
          >
            Buy 10 Credits (10 USDCx)
          </Button>
          {!hasUsdc && !usdcLoading && (
            <p className="text-[10px] text-amber-500/80 font-mono text-center">
              No USDCx.{" "}
              <Link href="/settings" className="underline hover:text-amber-400">
                Claim test tokens →
              </Link>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
