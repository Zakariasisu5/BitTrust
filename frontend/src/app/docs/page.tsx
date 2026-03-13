"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <Card className="matte-card max-w-lg w-full p-10 border-slate-800 bg-slate-900/40">
        <CardContent className="flex flex-col items-center p-0">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <BookOpen className="h-10 w-10 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Documentation</h1>
          <p className="text-slate-400 mb-8">
            The developer portal and API documentation for the BitTrust x402 protocol are currently being finalized.
          </p>
          
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 mb-8 w-full text-left font-mono text-sm text-slate-300">
            <p className="text-slate-500 mb-2">// Sneak peek: API Access</p>
            <p><span className="text-emerald-500">curl</span> -X GET https://api.bittrust.network/v1/score/ST123...</p>
            <p className="mt-2">-H <span className="text-amber-500">"Authorization: L402 [macaroon] [preimage]"</span></p>
          </div>

          <Button asChild variant="outline" className="secondary-btn border-slate-700">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
