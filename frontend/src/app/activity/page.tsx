"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWallet } from "@/context/WalletContext";
import { AlertCircle, Filter, ExternalLink } from "lucide-react";

const allEvents = [
  { id: "tx-1", date: "2025-03-12 14:30", type: "Repayment", protocol: "Alex DeFi", desc: "Loan repaid in full", impact: "+25", status: "Confirmed" },
  { id: "tx-2", date: "2025-03-10 09:15", type: "Governance", protocol: "StackingDAO", desc: "Voted on Proposal #42", impact: "+5", status: "Confirmed" },
  { id: "tx-3", date: "2025-03-05 18:45", type: "DeFi", protocol: "Arkadiko", desc: "Minted USDA", impact: "+10", status: "Confirmed" },
  { id: "tx-4", date: "2025-02-28 11:20", type: "DeFi", protocol: "Zest Protocol", desc: "Supplied sBTC liquidity", impact: "+15", status: "Confirmed" },
  { id: "tx-5", date: "2025-02-15 16:10", type: "Repayment", protocol: "Alex DeFi", desc: "Partial loan repayment", impact: "+10", status: "Confirmed" },
  { id: "tx-6", date: "2025-02-01 08:05", type: "Risk", protocol: "Unknown", desc: "High velocity transfers detected", impact: "-5", status: "Warning" },
  { id: "tx-7", date: "2025-01-20 13:40", type: "Governance", protocol: "CityCoins", desc: "Voted on MIA upgrade", impact: "+5", status: "Confirmed" },
  { id: "tx-8", date: "2025-01-10 10:00", type: "System", protocol: "BitTrust", desc: "Wallet crossed 3-year age", impact: "+50", status: "Confirmed" },
];

export default function ActivityPage() {
  const { isConnected } = useWallet();
  const [filter, setFilter] = useState("All");

  const filteredEvents = allEvents.filter((event) => {
    if (filter === "All") return true;
    if (filter === "Repayment") return event.type === "Repayment";
    if (filter === "DeFi") return event.type === "DeFi";
    if (filter === "Governance") return event.type === "Governance";
    return true;
  });

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
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10 border-b border-slate-800/50 bg-slate-900/30 pb-4">
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2 font-mono">
            <Filter className="h-4 w-4 text-amber-500" /> [{'>'} FILTER_LOGS]
          </CardTitle>
          <Tabs defaultValue="All" className="w-full sm:w-auto" onValueChange={setFilter}>
            <TabsList className="bg-[#050816] border border-slate-800 font-mono text-xs">
              <TabsTrigger value="All" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-500">ALL</TabsTrigger>
              <TabsTrigger value="Repayment" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-500">LOANS</TabsTrigger>
              <TabsTrigger value="DeFi" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-500">DEFI</TabsTrigger>
              <TabsTrigger value="Governance" className="data-[state=active]:bg-amber-500/10 data-[state=active]:text-amber-500">GOV</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-6 relative z-10 p-0 sm:p-6">
          <div className="rounded-md border border-slate-800 bg-[#050816] overflow-hidden">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 font-mono text-[10px] text-slate-500 flex items-center gap-2">
              <span className="text-purple-400">root@bittrust</span>:<span className="text-blue-400">~/activity</span>$ tail -f event_log.txt
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-xs text-slate-500 font-mono">TIMESTAMP</TableHead>
                  <TableHead className="text-xs text-slate-500 font-mono">PROTOCOL</TableHead>
                  <TableHead className="text-xs text-slate-500 font-mono">EVENT</TableHead>
                  <TableHead className="text-xs text-slate-500 font-mono">STATUS</TableHead>
                  <TableHead className="text-xs text-slate-500 text-right font-mono">IMPACT_Δ</TableHead>
                  <TableHead className="text-xs text-slate-500 text-right font-mono">TX</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-slate-500 font-mono">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <span className="text-amber-500">{'>'} NO_EVENTS_FOUND_</span>
                        <span className="text-[10px] animate-pulse">Waiting for new incoming blocks...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id} className="border-slate-800 hover:bg-slate-900/60 border-l-2 border-l-transparent hover:border-l-amber-500 transition-colors">
                      <TableCell className="text-xs text-slate-400 font-mono whitespace-nowrap">{event.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] py-0 border-slate-700 text-slate-300 font-mono uppercase">
                          {event.protocol}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-300 font-mono text-xs">{event.desc}</TableCell>
                      <TableCell>
                        <span className={`text-xs font-mono ${event.status === 'Confirmed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          [{event.status.toUpperCase()}]
                        </span>
                      </TableCell>
                      <TableCell className={`text-right text-xs font-bold font-mono ${event.impact.startsWith('-') ? 'text-red-500' : 'text-emerald-500'}`}>
                        {event.impact}
                      </TableCell>
                      <TableCell className="text-right">
                        <button className="text-slate-500 hover:text-amber-500 transition-colors">
                          <ExternalLink className="h-4 w-4 ml-auto" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
