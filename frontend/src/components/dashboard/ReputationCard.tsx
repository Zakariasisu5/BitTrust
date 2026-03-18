"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, TrendingUp } from "lucide-react";
import { getTierFromScore, formatLastUpdatedIso, toDisplayScore } from "@/lib/score-utils";

interface ReputationCardProps {
  // raw 0–100 score from backend
  score: number;
  tier?: string;
  tierLabel?: string;
  trustLevel?: string;
  explanation?: string;
  lastUpdated: string;
  isLoading?: boolean;
}

const TIER_COLORS: Record<string, string> = {
  "A+": "border-emerald-500/50 text-emerald-400 bg-emerald-500/10",
  "A":  "border-amber-500/50 text-amber-400 bg-amber-500/10",
  "B":  "border-yellow-500/50 text-yellow-400 bg-yellow-500/10",
  "C":  "border-red-500/50 text-red-400 bg-red-500/10",
};

export const ReputationCard = ({
  score,
  tier: tierProp,
  tierLabel: tierLabelProp,
  explanation,
  lastUpdated,
  isLoading = false,
}: ReputationCardProps) => {
  const derived = getTierFromScore(score);
  const tier = tierProp ?? derived.tier;
  const tierLabel = tierLabelProp ?? derived.label;
  const displayScore = toDisplayScore(score);
  const pct = Math.min(100, (displayScore / 1000) * 100);
  const tierColor = TIER_COLORS[tier] ?? TIER_COLORS["C"];

  // Next tier threshold for projection
  const nextTierScore = score < 31 ? 310 : score < 61 ? 610 : score < 81 ? 810 : null;
  const pointsToNext = nextTierScore ? nextTierScore - displayScore : null;

  if (isLoading) {
    return (
      <Card className="matte-card overflow-hidden">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24 bg-slate-800" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-32 bg-slate-800" />
          <Skeleton className="h-2 w-full bg-slate-800" />
          <Skeleton className="h-4 w-3/4 bg-slate-800" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="matte-card overflow-hidden glow-amber">
      <div className="scanline" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-slate-400 font-mono">
          [{">"} GLOBAL_TRUST_SCORE]
        </CardTitle>
        <Badge variant="outline" className={`font-mono text-xs ${tierColor}`}>
          TIER {tier}
        </Badge>
      </CardHeader>
      <CardContent className="relative z-10 space-y-4">
        {/* Score display */}
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tight text-amber-500">
            {displayScore}
          </span>
          <span className="text-sm text-slate-500 font-mono">/ 1000</span>
        </div>

        {/* Tier label */}
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${
            score >= 81 ? "bg-emerald-500" : score >= 61 ? "bg-amber-500" : score >= 31 ? "bg-yellow-500" : "bg-red-500"
          }`} />
          <p className="text-sm font-semibold text-slate-300 uppercase tracking-widest font-mono">
            {tierLabel}
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-500 shadow-[0_0_8px_#F7931A] transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
          {pointsToNext !== null && (
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
              <TrendingUp className="h-3 w-3 text-amber-500/60" />
              +{pointsToNext} pts to next tier
            </div>
          )}
        </div>

        {/* Explanation from AI engine */}
        {explanation && (
          <p className="text-[10px] text-slate-500 font-mono border-t border-slate-800 pt-3 leading-relaxed">
            {explanation}
          </p>
        )}

        <p className="text-[10px] text-slate-600 flex items-center gap-1 font-mono">
          <Info className="h-3 w-3" />
          [UPDATED: {formatLastUpdatedIso(lastUpdated)}] — STACKS_INDEXER
        </p>
      </CardContent>
    </Card>
  );
};
