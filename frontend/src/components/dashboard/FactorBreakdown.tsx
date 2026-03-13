"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

const factors = [
  { name: "Wallet Age", value: "3.2 Years", impact: "+45", color: "text-emerald-500" },
  { name: "Tx Frequency", value: "142/Mo", impact: "+32", color: "text-emerald-500" },
  { name: "Loan Repayments", value: "100%", impact: "+120", color: "text-emerald-500" },
  { name: "DeFi Activity", value: "High", impact: "+15", color: "text-emerald-500" },
  { name: "Risk Flags", value: "None", impact: "0", color: "text-slate-400" },
];

export const FactorBreakdown = () => {
  return (
    <Card className="matte-card">
      <div className="absolute inset-0 bg-grid-slate-900 opacity-20 pointer-events-none" />
      <CardHeader className="relative z-10">
        <CardTitle className="text-sm font-medium text-slate-400 font-mono">[{'>'} RISK_FACTORS]</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-2">
          {factors.map((factor, i) => (
            <div key={i} className="flex items-center justify-between border-l-2 border-transparent hover:border-amber-500 hover:bg-slate-900/50 p-2 rounded transition-all">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-200">{factor.name}</span>
                <Info className="h-3 w-3 text-slate-500" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500 font-mono">{factor.value}</span>
                <span className={`text-xs font-bold font-mono ${factor.color}`}>{factor.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
