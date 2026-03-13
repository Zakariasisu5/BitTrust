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
          <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
          <p className="text-slate-500">Comprehensive history of your on-chain reputation events.</p>
        </div>
      </div>

      <Card className="matte-card">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filter Events
          </CardTitle>
          <Tabs defaultValue="All" className="w-full sm:w-auto" onValueChange={setFilter}>
            <TabsList className="bg-slate-900 border border-slate-800">
              <TabsTrigger value="All" className="data-[state=active]:bg-slate-800 data-[state=active]:text-amber-500">All</TabsTrigger>
              <TabsTrigger value="Repayment" className="data-[state=active]:bg-slate-800 data-[state=active]:text-amber-500">Loans</TabsTrigger>
              <TabsTrigger value="DeFi" className="data-[state=active]:bg-slate-800 data-[state=active]:text-amber-500">DeFi</TabsTrigger>
              <TabsTrigger value="Governance" className="data-[state=active]:bg-slate-800 data-[state=active]:text-amber-500">Governance</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent bg-slate-900/50">
                  <TableHead className="text-xs text-slate-500">Timestamp</TableHead>
                  <TableHead className="text-xs text-slate-500">Protocol</TableHead>
                  <TableHead className="text-xs text-slate-500">Event</TableHead>
                  <TableHead className="text-xs text-slate-500">Status</TableHead>
                  <TableHead className="text-xs text-slate-500 text-right">Impact</TableHead>
                  <TableHead className="text-xs text-slate-500 text-right">Tx</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                      No events found for this category.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id} className="border-slate-800 hover:bg-slate-900/40">
                      <TableCell className="text-xs text-slate-400 font-mono whitespace-nowrap">{event.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] py-0 border-slate-700 text-slate-300">
                          {event.protocol}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-300">{event.desc}</TableCell>
                      <TableCell>
                        <span className={`text-xs font-medium ${event.status === 'Confirmed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {event.status}
                        </span>
                      </TableCell>
                      <TableCell className={`text-right text-xs font-bold ${event.impact.startsWith('-') ? 'text-red-500' : 'text-emerald-500'}`}>
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
