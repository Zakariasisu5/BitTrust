"use client";

import { useLeaderboardQuery } from "@/hooks/useLeaderboardQuery";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, AlertCircle } from "lucide-react";

function truncateWallet(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function LeaderboardContent() {
  const { data: entries, isLoading, error } = useLeaderboardQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="font-mono text-xs text-amber-500 mb-2">
            {"// LEADERBOARD_MODULE"}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">
            Leaderboard
          </h1>
          <p className="text-slate-500">
            Top wallets by reputation score.
          </p>
        </div>
        <Card className="matte-card">
          <CardHeader>
            <Skeleton className="h-4 w-32 bg-slate-800" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full bg-slate-800" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold">Backend unavailable</h2>
        <p className="mt-2 text-slate-500 font-mono text-sm">
          {String(error)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <div className="font-mono text-xs text-amber-500 mb-2">
          {"// LEADERBOARD_MODULE"}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">
          Leaderboard
        </h1>
        <p className="text-slate-500">
          Top wallets by reputation score.
        </p>
      </div>

      <Card className="matte-card relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
        <CardHeader className="relative z-10 border-b border-slate-800/50 bg-slate-900/30">
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2 font-mono">
            <Trophy className="h-4 w-4 text-amber-500" /> [{">"} TOP_WALLETS]
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 relative z-10">
          {!entries || entries.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-sm">
              No entries yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-xs text-slate-500 font-mono w-16">
                    RANK
                  </TableHead>
                  <TableHead className="text-xs text-slate-500 font-mono">
                    WALLET
                  </TableHead>
                  <TableHead className="text-xs text-slate-500 font-mono text-right">
                    SCORE
                  </TableHead>
                  <TableHead className="text-xs text-slate-500 font-mono">
                    TIER
                  </TableHead>
                  <TableHead className="text-xs text-slate-500 font-mono text-right">
                    LOAN
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, i) => (
                  <TableRow
                    key={entry.wallet}
                    className="border-slate-800 hover:bg-slate-900/40 border-l-2 border-l-transparent hover:border-l-amber-500 transition-colors"
                  >
                    <TableCell className="font-mono text-slate-400">
                      #{i + 1}
                    </TableCell>
                    <TableCell className="font-mono text-slate-200">
                      {truncateWallet(entry.wallet)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-amber-500">
                      {entry.reputationScore * 10}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-slate-700 text-slate-300 font-mono text-xs"
                      >
                        {entry.trustLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-mono text-xs ${entry.loanEligibility ? "text-emerald-500" : "text-slate-500"}`}
                      >
                        {entry.loanEligibility ? "OK" : "-"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
