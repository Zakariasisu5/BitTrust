"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

interface ReputationCardProps {
  score: number;
  tier: string;
  label: string;
  lastUpdated: string;
}

export const ReputationCard = ({ score, tier, label, lastUpdated }: ReputationCardProps) => {
  return (
    <Card className="matte-card overflow-hidden glow-amber">
      <div className="scanline" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-slate-400">
          {" "}
          [{">"} GLOBAL_TRUST_SCORE]
        </CardTitle>
        <Badge
          variant="outline"
          className="border-amber-500/50 text-amber-500 bg-amber-500/10 font-mono"
        >
          TIER {tier}
        </Badge>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tight text-amber-500">
            {score}
          </span>
          <span className="text-sm text-slate-500 font-mono">/ 1000</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${score > 700 ? "bg-emerald-500" : score > 400 ? "bg-amber-500" : "bg-red-500"}`}
          />
          <p className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
            {label}
          </p>
        </div>
        <p className="mt-4 text-[10px] text-slate-500 flex items-center gap-1 font-mono">
          <Info className="h-3 w-3" />
          [UPDATED: {lastUpdated}] - STACKS_INDEXER
        </p>
      </CardContent>
    </Card>
  );
};
