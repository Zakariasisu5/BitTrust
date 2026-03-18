"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { toDisplayScore } from "@/lib/score-utils";

// Loan tiers: score thresholds (0–100 backend scale) → loan terms
const LOAN_TIERS = [
  { minScore: 81, label: "Premium — up to 90% LTV, 0% extra collateral", color: "text-emerald-400" },
  { minScore: 61, label: "Standard — up to 75% LTV, low collateral",      color: "text-amber-400"  },
  { minScore: 31, label: "Basic — up to 50% LTV, standard collateral",    color: "text-yellow-400" },
];

interface LoanStatusProps {
  // raw 0–100 score
  score: number;
  loanEligibility?: boolean;
}

export const LoanStatus = ({ score, loanEligibility }: LoanStatusProps) => {
  const displayScore = toDisplayScore(score);
  // Minimum to qualify is tier B (score >= 31 → 310 display)
  const MIN_DISPLAY = 310;
  const isEligible = loanEligibility !== undefined ? loanEligibility : score >= 31;
  const progress = Math.min((displayScore / MIN_DISPLAY) * 100, 100);

  const currentTier = LOAN_TIERS.find((t) => score >= t.minScore);
  const nextTier = LOAN_TIERS.slice().reverse().find((t) => score < t.minScore);
  const pointsToNext = nextTier ? toDisplayScore(nextTier.minScore) - displayScore : null;

  return (
    <Card className="matte-card relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-slate-400 font-mono">
          [{">"} LOAN_ELIGIBILITY]
        </CardTitle>
        {isEligible ? (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/50 font-mono">OK</Badge>
        ) : (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/50 font-mono">DENIED</Badge>
        )}
      </CardHeader>
      <CardContent className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          {isEligible ? (
            <CheckCircle2 className="h-8 w-8 text-emerald-500 shrink-0" />
          ) : (
            <XCircle className="h-8 w-8 text-red-500 shrink-0" />
          )}
          <div>
            <p className="text-sm font-medium text-slate-200">
              {currentTier?.label ?? "Score too low for loan access"}
            </p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              MIN_SCORE: {MIN_DISPLAY} · CURRENT: {displayScore}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] uppercase tracking-wider text-slate-500 font-mono">
            <span>ELIGIBILITY_PROGRESS</span>
            <span>{displayScore} / {MIN_DISPLAY}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isEligible ? "bg-emerald-500 shadow-[0_0_10px_#10B981]" : "bg-amber-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Tier ladder */}
        <div className="space-y-1 border-t border-slate-800 pt-3">
          {LOAN_TIERS.map((t) => (
            <div
              key={t.minScore}
              className={`flex items-center gap-2 text-[10px] font-mono ${
                score >= t.minScore ? t.color : "text-slate-600"
              }`}
            >
              <span>{score >= t.minScore ? "✓" : "○"}</span>
              <span>{t.label}</span>
            </div>
          ))}
        </div>

        {/* Projection */}
        {pointsToNext !== null && pointsToNext > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-amber-500/70 font-mono">
            <TrendingUp className="h-3 w-3" />
            +{pointsToNext} pts unlocks better loan terms
          </div>
        )}
      </CardContent>
    </Card>
  );
};
