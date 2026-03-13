"use client";

import { useWallet } from "@/context/WalletContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Copy, 
  ExternalLink, 
  Calendar, 
  History, 
  ThumbsUp, 
  AlertTriangle,
  FileJson
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { address, isConnected, network } = useWallet();
  const { toast } = useToast();

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold">Wallet Disconnected</h1>
        <p className="mt-2 text-slate-400">Please connect your wallet to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-slate-500">Public identity and on-chain metrics.</p>
      </div>

      {/* Wallet Details Card */}
      <Card className="matte-card">
        <CardContent className="pt-6">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <User className="h-10 w-10 text-amber-500" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-mono tracking-tight">{address}</h2>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">{network}</Badge>
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <Calendar className="h-4 w-4" /> Joined March 2022
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-500 font-mono">
                  Age: 3.2 Y
                </div>
              </div>
            </div>
            <Button variant="outline" className="secondary-btn border-slate-800 gap-2">
              <FileJson className="h-4 w-4" /> Export Reputation JSON
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Signals Section */}
        <Card className="matte-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-emerald-500" /> Positive Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[
                "Early Stacks ecosystem participant",
                "100% successful loan repayment history",
                "Regular interaction with verified smart contracts",
                "Active participation in DAO governance",
                "Significant transaction volume (total > 50k STX)"
              ].map((signal, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {signal}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="matte-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Risk Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 mb-4">
                <ThumbsUp className="h-6 w-6 text-slate-700" />
              </div>
              <p className="text-sm font-medium text-slate-200">No flags detected</p>
              <p className="text-xs text-slate-500 mt-1">This wallet currently shows no suspicious activity or scam reports.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card className="matte-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <History className="h-4 w-4" /> Reputation History
          </CardTitle>
          <Button variant="link" className="text-xs text-amber-500">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              { date: "Mar 01, 2025", old: 712, new: 732, reason: "Loan repayment verified on-chain" },
              { date: "Feb 15, 2025", old: 707, new: 712, reason: "Governance vote interaction bonus" },
              { date: "Feb 01, 2025", old: 680, new: 707, reason: "Monthly transaction volume bonus" },
              { date: "Jan 15, 2025", old: 650, new: 680, reason: "Wallet age milestone: 3 years" }
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">{row.date}</p>
                  <p className="text-sm text-slate-200">{row.reason}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Change</p>
                    <p className="text-sm font-bold text-emerald-500">+{row.new - row.old}</p>
                  </div>
                  <div className="text-right w-16">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Score</p>
                    <p className="text-sm font-bold text-slate-100">{row.new}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
