"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

interface LoanStatusProps {
  score: number;
  minScore: number;
}

export const LoanStatus = ({ score, minScore }: LoanStatusProps) => {
  const isEligible = score >= minScore;
  const progress = Math.min((score / minScore) * 100, 100);

  return (
    <Card className="matte-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">Loan Eligibility</CardTitle>
        {isEligible ? (
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/50">Eligible</Badge>
        ) : (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/50">Not Eligible</Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="mt-2 flex items-center gap-3">
          {isEligible ? (
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          ) : (
            <XCircle className="h-8 w-8 text-red-500" />
          )}
          <div>
            <p className="text-sm font-medium text-slate-200">
              {isEligible 
                ? "Qualified for low-collateral loans" 
                : "Higher collateral required"}
            </p>
            <p className="text-xs text-slate-500">Min score required: {minScore}</p>
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-[10px] uppercase tracking-wider text-slate-500">
            <span>Progress</span>
            <span>{score} / {minScore}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${isEligible ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
