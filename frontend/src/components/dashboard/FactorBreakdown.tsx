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
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-400">Factor Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {factors.map((factor, i) => (
            <div key={i} className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-200">{factor.name}</span>
                <Info className="h-3 w-3 text-slate-500" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500">{factor.value}</span>
                <span className={`text-xs font-bold ${factor.color}`}>{factor.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
