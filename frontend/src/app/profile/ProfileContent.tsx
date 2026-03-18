"use client";

import { useWallet } from "@/context/WalletContext";
import { useReputationQuery } from "@/hooks/useReputationQuery";
import { useReputationHistoryQuery } from "@/hooks/useReputationHistoryQuery";
import { useCreditsBalance, useReputationScore } from "@/hooks/useContractRead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Copy, ExternalLink, Calendar, History, ThumbsUp, AlertTriangle, FileJson, TrendingUp, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatLastUpdatedIso, toDisplayScore, getTierFromScore } from "@/lib/score-utils";

const TIER_COLORS: Record<string, string> = {
  "A+": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  "A": "bg-amber-500/10 text-amber-400 border-amber-500/30",
  "B": "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  "C": "bg-red-500/10 text-red-400 border-red-500/30",
};

export function ProfileContent() {
  const { address, isConnected, network } = useWallet();
  const { toast } = useToast();
  const reputationQuery = useReputationQuery(address ?? null, network);
  const historyQuery = useReputationHistoryQuery(address ?? null, network);
  const contractScore = useReputationScore(address ?? null);
  const { balance: creditsBalance } = useCreditsBalance(address ?? null);

  const data = reputationQuery.data;
  const displayScore = data ? toDisplayScore(data.reputationScore) : 0;
  const scoreLoading = reputationQuery.isLoading;
  const txCount = data?.metadata?.totalTxsAnalyzed;
  const score = data?.reputationScore ?? 0;
  const tier = data?.tier ?? getTierFromScore(score).tier;
  const tierLabel = data?.tierLabel ?? getTierFromScore(score).label;
  const tierColor = TIER_COLORS[tier] ?? TIER_COLORS["C"];
  const nextTierDisplay = score < 31 ? 310 : score < 61 ? 610 : score < 81 ? 810 : null;
  const pointsToNext = nextTierDisplay ? nextTierDisplay - displayScore : null;

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({ title: "Address Copied", description: "Wallet address copied to clipboard." });
    }
  };

  const handleExport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bittrust-${address?.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Identity and Metrics</h1>
        <p className="text-slate-500">Public footprint and on-chain variables.</p>
      </div>

      <Card className="matte-card glow-amber relative">
        <div className="scanline" />
        <CardHeader className="border-b border-slate-800/50 bg-slate-900/30 pb-3 mb-4 relative z-10">
          <CardTitle className="text-xs font-mono text-slate-400">{"[> NODE_IDENTITY]"}</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 relative z-10">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-start">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#050816] border-2 border-amber-500/50 shadow-[0_0_15px_rgba(247,147,26,0.2)] shrink-0">
              <User className="h-10 w-10 text-amber-500" />
            </div>
            <div className="flex-1 space-y-3 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold font-mono tracking-tight text-slate-200 break-all">{address}</h2>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-amber-500 shrink-0" onClick={handleCopy}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <a href={`https://explorer.hiro.so/address/${address}?chain=${network}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-amber-500 shrink-0">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
              <div className="flex flex-wrap gap-2 font-mono">
                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs">{network.toUpperCase()}</Badge>
                {!scoreLoading ? (
                  <>
                    <Badge className={`text-xs border ${tierColor}`}>TIER {tier} - {tierLabel}</Badge>
                    <Badge className="bg-slate-800 text-amber-500 border-slate-700 text-xs">AI_SCORE: {displayScore}/1000</Badge>
                    {!contractScore.isLoading && contractScore.score > 0 && (
                      <Badge className="bg-slate-800 text-emerald-400 border-slate-700 text-xs flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> ON_CHAIN: {contractScore.score}/100
                      </Badge>
                    )}
                    <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs">CREDITS: {creditsBalance}</Badge>
                    {txCount !== undefined && (
                      <Badge className="bg-slate-800 text-slate-400 border-slate-700 text-xs">TXS_ANALYZED: {txCount}</Badge>
                    )}
                  </>
                ) : (
                  <Skeleton className="h-5 w-48 bg-slate-800" />
                )}
              </div>
              {!scoreLoading && !contractScore.isLoading && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded border border-slate-800 bg-slate-950/50 p-2 font-mono text-[10px]">
                    <p className="text-slate-500 mb-1">AI_ENGINE_SCORE</p>
                    <p className="text-amber-500 font-bold text-lg">{displayScore}</p>
                    <p className="text-slate-600">/ 1000 - {data?.metadata?.network ?? network}</p>
                  </div>
                  <div className="rounded border border-slate-800 bg-slate-950/50 p-2 font-mono text-[10px]">
                    <p className="text-slate-500 mb-1">ON_CHAIN_STAMP</p>
                    <p className={`font-bold text-lg ${contractScore.score > 0 ? "text-emerald-400" : "text-slate-600"}`}>
                      {contractScore.score > 0 ? contractScore.score : "-"}
                    </p>
                    <p className="text-slate-600">
                      {contractScore.score > 0 ? `/ 100 - block #${contractScore.lastUpdated}` : "not stamped yet"}
                    </p>
                  </div>
                </div>
              )}
              {pointsToNext !== null && pointsToNext > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-amber-500/70 font-mono">
                  <TrendingUp className="h-3 w-3" /> +{pointsToNext} pts to unlock next tier
                </div>
              )}
              <div className="flex items-center gap-1 text-[10px] text-slate-600 font-mono">
                <Calendar className="h-3 w-3" /> LAST_UPDATED: {data?.lastUpdated ? formatLastUpdatedIso(data.lastUpdated) : "-"}
              </div>
            </div>
            <Button variant="outline" className="secondary-btn border-slate-800 gap-2 font-mono text-xs shrink-0" onClick={handleExport} disabled={!data}>
              <FileJson className="h-4 w-4" /> EXPORT_JSON
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="matte-card relative overflow-hidden border-t-2 border-t-emerald-500/50">
          <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2 font-mono">
              <ThumbsUp className="h-4 w-4 text-emerald-500" /> {"[> POSITIVE_SIGNALS]"}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            {scoreLoading ? (
              <div className="space-y-3 animate-pulse">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-4 bg-slate-800 rounded" />)}</div>
            ) : data?.factors ? (
              <>
                <ul className="space-y-3">
                  {data.factors
                    .filter((f) => f.contribution > 0)
                    .sort((a, b) => b.contribution - a.contribution)
                    .map((f) => {
                      const pct = Math.round((f.contribution / f.max) * 100);
                      return (
                        <li key={f.name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="flex items-center gap-2 text-slate-300">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10B981]" />
                              {f.label}
                            </span>
                            <span className="text-emerald-400">+{f.contribution}/{f.max}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 rounded-full bg-slate-800">
                              <div className="h-full rounded-full bg-emerald-500/60" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono w-20 text-right truncate">{f.raw}</span>
                          </div>
                        </li>
                      );
                    })}
                </ul>
                {data.explanation && (
                  <p className="mt-4 text-[10px] text-slate-500 font-mono border-t border-slate-800 pt-3 leading-relaxed">{data.explanation}</p>
                )}
              </>
            ) : <p className="text-xs text-slate-500 font-mono">No data available.</p>}
          </CardContent>
        </Card>

        <Card className="matte-card relative overflow-hidden border-t-2 border-t-red-500/50">
          <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2 font-mono">
              <AlertTriangle className="h-4 w-4 text-red-500" /> {"[> RISK_FLAGS]"}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            {scoreLoading ? (
              <div className="space-y-3 animate-pulse">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-4 bg-slate-800 rounded" />)}</div>
            ) : data?.factors ? (
              (() => {
                const risks = data.factors.filter((f) => f.contribution < f.max * 0.4);
                return risks.length > 0 ? (
                  <ul className="space-y-3">
                    {risks.map((f) => {
                      const pct = Math.round((f.contribution / f.max) * 100);
                      return (
                        <li key={f.name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="flex items-center gap-2 text-slate-300">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                              {f.label}
                            </span>
                            <span className="text-red-400">{f.contribution}/{f.max}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 rounded-full bg-slate-800">
                              <div className="h-full rounded-full bg-red-500/60" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono w-20 text-right truncate">{f.raw}</span>
                          </div>
                          <p className="text-[10px] text-slate-600 font-mono pl-3">+{f.max - f.contribution} pts possible - {f.description}</p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="h-12 w-12 rounded-full bg-[#050816] flex items-center justify-center border border-slate-800 mb-4">
                      <ThumbsUp className="h-5 w-5 text-emerald-500/50" />
                    </div>
                    <p className="text-sm font-mono text-slate-200">NO_RISKS_DETECTED</p>
                    <p className="text-xs text-slate-500 mt-2 font-mono max-w-[250px]">All factors scoring above threshold.</p>
                  </div>
                );
              })()
            ) : <p className="text-xs text-slate-500 font-mono">No data available.</p>}
          </CardContent>
        </Card>
      </div>

      <Card className="matte-card relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between relative z-10 border-b border-slate-800/50 bg-slate-900/30">
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2 font-mono">
            <History className="h-4 w-4 text-amber-500" /> {"[> REPUTATION_LOG]"}
          </CardTitle>
          <span className="text-[10px] text-slate-600 font-mono">{historyQuery.data?.length ?? 0} entries</span>
        </CardHeader>
        <CardContent className="pt-4 relative z-10">
          {historyQuery.isLoading ? (
            <div className="space-y-4 animate-pulse">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-slate-800 rounded" />)}</div>
          ) : historyQuery.data && historyQuery.data.length > 0 ? (
            <div className="space-y-2">
              {historyQuery.data.slice().reverse().map((entry, i, arr) => {
                const prev = arr[i + 1];
                const newScore = toDisplayScore(entry.reputationScore);
                const oldScore = prev ? toDisplayScore(prev.reputationScore) : newScore;
                const delta = newScore - oldScore;
                const entryTier = getTierFromScore(entry.reputationScore);
                const tierChanged = prev && getTierFromScore(prev.reputationScore).tier !== entryTier.tier;
                return (
                  <div key={entry.lastUpdated + i} className="flex items-center justify-between border-l-2 border-transparent hover:border-amber-500 hover:bg-slate-900/40 px-3 py-2 rounded transition-all">
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-[10px] text-slate-500 font-mono">{formatLastUpdatedIso(entry.lastUpdated)}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs text-slate-300 font-mono">
                          {tierChanged ? `[TIER_CHANGE to ${entryTier.tier}]` : "[SYS_OK] Score update"}
                        </p>
                        {tierChanged && (
                          <Badge className={`text-[9px] px-1 py-0 border ${TIER_COLORS[entryTier.tier] ?? ""}`}>{entryTier.tier}</Badge>
                        )}
                      </div>
                      {entry.explanation && (
                        <p className="text-[10px] text-slate-600 font-mono truncate max-w-xs">{entry.explanation}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-500 uppercase font-mono">DELTA</p>
                        <p className={`text-sm font-bold font-mono ${delta > 0 ? "text-emerald-500" : delta < 0 ? "text-red-500" : "text-slate-500"}`}>
                          {delta > 0 ? "+" : ""}{delta}
                        </p>
                      </div>
                      <div className="text-right w-16">
                        <p className="text-[10px] text-slate-500 uppercase font-mono">SCORE</p>
                        <p className="text-sm font-bold text-slate-100 font-mono">{newScore}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-500 font-mono">No reputation history yet.</p>
              <p className="text-[10px] text-slate-600 font-mono mt-1">Click Refresh Data on the dashboard to compute your first score.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileContent;