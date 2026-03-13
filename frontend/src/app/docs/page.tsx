"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <Card className="matte-card max-w-lg w-full p-0 border-slate-800 bg-[#050816] overflow-hidden glow-amber">
        <div className="scanline" />
        <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-4 py-2 relative z-10">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 font-mono text-[10px] text-slate-500">docs_terminal</span>
        </div>
        <CardContent className="flex flex-col items-center p-10 relative z-10">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#050816] border-2 border-amber-500/50 shadow-[0_0_15px_rgba(247,147,26,0.2)]">
            <BookOpen className="h-10 w-10 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-100">Documentation</h1>
          <p className="text-slate-400 mb-8 text-sm">
            The developer portal and API documentation for the BitTrust x402 protocol are currently being finalized.
          </p>
          
          <div className="rounded border border-slate-800 bg-slate-950 p-4 mb-8 w-full text-left font-mono text-[10px] sm:text-xs text-slate-300">
            <p className="text-slate-500 mb-2">{"//"} Sneak peek: API Access</p>
            <p><span className="text-purple-400">dev@local:~$</span> curl -i https://api.bittrust.network/v1/score/ST123...</p>
            <p className="mt-2">-H <span className="text-amber-500">"Authorization: L402 [macaroon] [preimage]"</span></p>
          </div>

          <Button asChild variant="outline" className="secondary-btn border-slate-700 font-mono text-xs">
            <Link href="/dashboard">
              {">"} RETURN_TO_DASHBOARD
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
