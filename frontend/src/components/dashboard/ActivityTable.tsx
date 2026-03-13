"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const events = [
  { 
    date: "2025-03-01", 
    type: "Repayment", 
    description: "Loan repaid on Alex DeFi", 
    impact: "+20", 
    status: "Success" 
  },
  { 
    date: "2025-02-15", 
    type: "Governance", 
    description: "Voted on SIP-015", 
    impact: "+5", 
    status: "Success" 
  },
  { 
    date: "2025-02-01", 
    type: "Volume", 
    description: "High volume tx detected", 
    impact: "+10", 
    status: "Neutral" 
  },
  { 
    date: "2025-01-20", 
    type: "Contract", 
    description: "Interaction with verified protocol", 
    impact: "+5", 
    status: "Success" 
  },
];

export const ActivityTable = () => {
  return (
    <Card className="matte-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-400">Recent Reputation Events</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-xs text-slate-500">Date</TableHead>
              <TableHead className="text-xs text-slate-500">Type</TableHead>
              <TableHead className="text-xs text-slate-500">Description</TableHead>
              <TableHead className="text-xs text-slate-500 text-right">Impact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event, i) => (
              <TableRow key={i} className="border-slate-800 hover:bg-slate-900/40">
                <TableCell className="text-xs text-slate-400 font-mono">{event.date}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] py-0 border-slate-700 text-slate-300">
                    {event.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-300">{event.description}</TableCell>
                <TableCell className="text-right text-xs font-bold text-emerald-500">{event.impact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
