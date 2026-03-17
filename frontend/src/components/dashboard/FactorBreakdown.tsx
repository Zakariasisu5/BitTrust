"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import type { ScoreFactor } from "@/types/backend";

const FACTOR_COLORS: Record<string, string> = {
  WALLET_AGE_STABILITY: "text-blue-400",
  TX_SUCCESS_VELOCITY: "text-emerald-400",
  DEFI_CONTRACT_ACTIVITY: "text-amber-400",
  COMMUNITY_ENGAGEMENT: "text-purple-400",
};

interface FactorBreakdownProps {
  factors?: ScoreFactor[];
}

export const FactorBreakdown = ({ factors }: FactorBreakdownProps) => {
  const items = factors && factors.length > 0 ? factors : null;

  return (
    <Card className="matte-card">
      <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
      <CardHeader className="relative z-10">
        <CardTitle className="text-sm font-medium text-slate-400 font-mono">
          [{">"} RISK_FACTORS]
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-2">
          {items
            ? items.map((factor) => {
                const pct = Math.round((factor.contribution / factor.max) * 100);
                const color = FACTOR_COLORS[factor.name] ?? "text-slate-400";
                return (
                  <div
                    key={factor.name}
                    className="border-l-2 border-transparent hover:border-amber-500 hover:bg-slate-900/50 p-2 rounded transition-all"
                    title={factor.description}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-200 font-mono">
                          {factor.label}
                        </span>
                        <Info className="h-3 w-3 text-slate-500 shrink-0" />
                      </div>
                      <span className={`text-xs font-bold font-mono ${color}`}>
                        +{factor.contribution}/{factor.max}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-slate-800">
                        <div
                          className={`h-full rounded-full ${color.replace("text-", "bg-")}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono w-16 text-right truncate">
                        {factor.raw}
                      </span>
                    </div>
                  </div>
                );
              })
            : // Skeleton placeholders while loading
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-2 space-y-1 animate-pulse">
                  <div className="h-3 bg-slate-800 rounded w-3/4" />
                  <div className="h-1 bg-slate-800 rounded w-full" />
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  );
};
