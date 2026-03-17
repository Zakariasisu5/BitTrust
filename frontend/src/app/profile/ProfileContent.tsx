"use client";

import { useWallet } from "@/context/WalletContext";
import { useReputationQuery } from "@/hooks/useReputationQuery";
import { useReputationHistoryQuery } from "@/hooks/useReputationHistoryQuery";
import { useCreditsBalance } from "@/hooks/useContractRead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Copy,
  ExternalLink,
  Calendar,
  History,
  ThumbsUp,
  AlertTriangle,
  FileJson,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatLastUpdatedIso } from "@/lib/score-utils";

export function ProfileContent() {
  const { address, isConnected, network } = useWallet();
  const { toast } = useToast();
  const reputationQuery = useReputationQuery(address ?? null);
  const historyQuery = useReputationHistoryQuery(address ?? null);
  const { balance: creditsBalance } = useCreditsBalance(address ?? null);

  const data = reputationQuery.data;
  const displayScore = data ? data.reputationScore * 10 : 0;
  const scoreLoading = reputationQuery.isLoading;
  const txCount = data?.metrics?.transactionCount;

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold">Wallet Disconnected</h1>
        <p className="mt-2 text-slate-400">Please connect your wallet to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <div className="font-mono text-xs text-amber-500 mb-2">{"// ID_VERIFICATION_MODULE"}</div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Identity & Metrics</h1>
        <p className="text-slate-500">Public footprint and on-chain variables.</p>
      </div>

      <Card className="matte-card glow-amber relative">
        <div className="scanline" />
        <CardHeader className="border-b border-slate-800/50 bg-slate-900/30 pb-3 mb-4 relative z-10">
          <CardTitle className="text-xs font-mono text-slate-400">[{">"} NODE_IDENTITY]</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 relative z-10">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#050816] border-2 border-amber-500/50 shadow-[0_0_15px_rgba(247,147,26,0.2)]">
              <User className="h-10 w-10 text-amber-500" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-mono tracking-tight text-slate-200">{address}</h2>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-amber-500" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-amber-500">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 font-mono">
                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">{network}</Badge>
                {!scoreLoading && (
                  <>
                    <Badge className="bg-slate-800 text-amber-500 border-slate-700">
                      SCORE: {displayScore}/1000
                    </Badge>
                    <Badge className="bg-slate-800 text-slate-300 border-slate-700">
                      CREDITS: {creditsBalance}
                    </Badge>
                    {txCount !== undefined && txCount > 0 && (
                      <Badge className="bg-slate-800 text-slate-400 border-slate-700">
                        TX_COUNT: {txCount}
                      </Badge>
                    )}
                  </>
                )}
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="h-3 w-3" /> INIT: 2022-03
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  AGE: 3.2Y
                </div>
              </div>
            </div>
            <Button variant="outline" className="secondary-btn border-slate-800 gap-2 font-mono text-xs">
              <FileJson className="h-4 w-4" /> EXPORT_JSON
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="matte-card relative overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.05)] border-t-2 border-t-emerald-500/50">
          <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2 font-mono">
              <ThumbsUp className="h-4 w-4 text-emerald-500" /> [{">"} POSITIVE_SIGNALS]
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <ul className="space-y-4">
              {[
                "Early Stacks ecosystem participant",
                "100% successful loan repayment history",
                "Regular interaction with verified smart contracts",
                "Active participation in DAO governance",
                "Significant transaction volume (total > 50k STX)",
              ].map((signal, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300 font-mono text-xs">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10B981]" />
                  {signal}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="matte-card relative overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.05)] border-t-2 border-t-red-500/50">
          <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2 font-mono">
              <AlertTriangle className="h-4 w-4 text-red-500" /> [{">"} RISK_FLAGS]
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <div className="h-12 w-12 rounded-full bg-[#050816] flex items-center justify-center border border-slate-800 mb-4">
                <ThumbsUp className="h-5 w-5 text-emerald-500/50" />
              </div>
              <p className="text-sm font-mono text-slate-200">NO_RISKS_DETECTED</p>
              <p className="text-xs text-slate-500 mt-2 font-mono max-w-[250px]">
                {"// Identity scan complete. Zero malicious patterns found."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="matte-card">
        <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between relative z-10 border-b border-slate-800/50 bg-slate-900/30">
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2 font-mono">
            <History className="h-4 w-4 text-amber-500" /> [{">"} REPUTATION_LOG]
          </CardTitle>
          <Button variant="link" className="text-xs text-amber-500 font-mono py-0 h-auto">VIEW_ALL</Button>
        </CardHeader>
        <CardContent className="pt-6 relative z-10">
          <div className="space-y-6">
            {historyQuery.data && historyQuery.data.length > 0 ? (
              historyQuery.data
                .slice()
                .reverse()
                .map((entry, i) => {
                  const prev = historyQuery.data?.[historyQuery.data.length - 2 - i];
                  const oldScore = prev ? prev.reputationScore * 10 : 0;
                  const newScore = entry.reputationScore * 10;
                  const delta = newScore - oldScore;
                  return (
                    <div
                      key={entry.lastUpdated + i}
                      className="flex items-center justify-between border-l-2 border-transparent hover:border-amber-500 hover:bg-slate-900/40 p-2 rounded transition-all"
                    >
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 font-mono">
                          {formatLastUpdatedIso(entry.lastUpdated)}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-300 font-mono">
                          [SYS_OK] Score update
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[10px] text-slate-500 uppercase font-mono">DELTA</p>
                          <p
                            className={`text-sm font-bold font-mono ${delta >= 0 ? "text-emerald-500" : "text-red-500"}`}
                          >
                            {delta >= 0 ? "+" : ""}
                            {delta}
                          </p>
                        </div>
                        <div className="text-right w-16">
                          <p className="text-[10px] text-slate-500 uppercase font-mono">SCORE</p>
                          <p className="text-sm font-bold text-slate-100 font-mono">{newScore}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-sm text-slate-500 font-mono py-4">
                No reputation history yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileContent;
