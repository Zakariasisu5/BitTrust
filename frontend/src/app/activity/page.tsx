"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWallet } from "@/context/WalletContext";
import { useReputationHistoryQuery } from "@/hooks/useReputationHistoryQuery";
import { AlertCircle, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatLastUpdatedIso, toDisplayScore } from "@/lib/score-utils";

export default function ActivityPage() {
  const { isConnected, address, network } = useWallet();
  const { data: history, isLoading } = useReputationHistoryQuery(address ?? null, network);

  const events =
    history && history.length > 0
      ? history
          .slice()
          .reverse()
          .map((entry, i) => {
            const prev = history[history.length - 2 - i];
            const oldScore = prev ? toDisplayScore(prev.reputationScore) : 0;
            const newScore = toDisplayScore(entry.reputationScore);
            const delta = newScore - oldScore;
            return {
              id: entry.lastUpdated + i,
              date: formatLastUpdatedIso(entry.lastUpdated),
              type: "Score",
              protocol: "BitTrust",
              desc: "Reputation score updated",
              impact: delta >= 0 ? `+${delta}` : `${delta}`,
              status: "Confirmed",
              score: newScore,
            };
          })
      : [];

  if (!isConnected) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 rounded-full bg-slate-900 p-6 border border-slate-800">
          <AlertCircle className="h-12 w-12 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold">Wallet Disconnected</h1>
        <p className="mt-2 text-slate-400">Please connect your wallet to view your activity log.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="font-mono text-xs text-amber-500 mb-2">{'// TRANSACTION_MONITOR'}</div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Activity Log</h1>
          <p className="text-slate-500">Comprehensive history of your on-chain reputation events.</p>
        </div>
      </div>

      <Card className="matte-card relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
        <CardHeader className="relative z-10 border-b border-slate-800/50 bg-slate-900/30 pb-4">
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2 font-mono">
            <Filter className="h-4 w-4 text-amber-500" /> [{">"} REPUTATION_EVENTS]
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 relative z-10 p-0 sm:p-6">
          <div className="rounded-md border border-slate-800 bg-[#050816] overflow-hidden">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 font-mono text-[10px] text-slate-500 flex items-center gap-2">
              <span className="text-purple-400">root@bittrust</span>:<span className="text-blue-400">~/activity</span>$ tail -f reputation_log.txt
            </div>
            {isLoading ? (
              <div className="p-8 space-y-3">
                <Skeleton className="h-12 w-full bg-slate-800" />
                <Skeleton className="h-12 w-full bg-slate-800" />
                <Skeleton className="h-12 w-full bg-slate-800" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-xs text-slate-500 font-mono">TIMESTAMP</TableHead>
                    <TableHead className="text-xs text-slate-500 font-mono">PROTOCOL</TableHead>
                    <TableHead className="text-xs text-slate-500 font-mono">EVENT</TableHead>
                    <TableHead className="text-xs text-slate-500 font-mono">STATUS</TableHead>
                    <TableHead className="text-xs text-slate-500 text-right font-mono">SCORE</TableHead>
                    <TableHead className="text-xs text-slate-500 text-right font-mono">IMPACT_Δ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-slate-500 font-mono">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <span className="text-amber-500">{">"} NO_EVENTS_FOUND_</span>
                          <span className="text-[10px]">Connect wallet and refresh reputation to see score history.</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    events.map((event) => (
                      <TableRow
                        key={event.id}
                        className="border-slate-800 hover:bg-slate-900/60 border-l-2 border-l-transparent hover:border-l-amber-500 transition-colors"
                      >
                        <TableCell className="text-xs text-slate-400 font-mono whitespace-nowrap">{event.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] py-0 border-slate-700 text-slate-300 font-mono uppercase">
                            {event.protocol}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-slate-300 font-mono">{event.desc}</TableCell>
                        <TableCell>
                          <span className="text-xs font-mono text-emerald-500">[{event.status}]</span>
                        </TableCell>
                        <TableCell className="text-right text-xs font-bold font-mono text-amber-500">{event.score}</TableCell>
                        <TableCell
                          className={`text-right text-xs font-bold font-mono ${event.impact.startsWith("-") ? "text-red-500" : "text-emerald-500"}`}
                        >
                          {event.impact}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
