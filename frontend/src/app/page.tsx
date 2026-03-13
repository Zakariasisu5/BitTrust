"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/context/WalletContext";
import {
  ShieldCheck,
  Zap,
  Bot,
  ArrowRight,
  BarChart3,
  Lock,
  Coins,
  CheckCircle2,
  Activity
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isConnected, connect } = useWallet();
  const router = useRouter();
  return (
    <div className="flex flex-col gap-20 py-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center">
        <div className="mb-8">
          <Image
            src="/logo.png"
            alt="BitTrust Logo"
            width={240}
            height={80}
            className="h-auto w-48 object-contain"
            priority
          />
        </div>
        <div className="mb-6 flex animate-fade-in items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-500">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>The Trust Layer for the Agentic Economy</span>
        </div>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          On-chain reputation for <br />
          <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Bitcoin Wallets
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          BitTrust analyzes blockchain activity to generate dynamic trust scores,
          enabling AI agents and DeFi protocols to verify reliability autonomously.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {isConnected ? (
            <Button asChild className="primary-btn h-12 px-8">
              <Link href="/dashboard">
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button onClick={connect} className="primary-btn h-12 px-8 text-lg">
              Connect Stacks Wallet
            </Button>
          )}
          <Button
          variant="outline"
          className="secondary-btn h-12 px-8 border-slate-700"
          onClick={() => router.push('/docs')}>
            Learn How It Works
          </Button>
        </div>

        {/* Mock Score Widget Placeholder */}
        <div className="mt-16 w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Reputation Score</span>
            <span>STX Network</span>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <div className="text-7xl font-bold text-amber-500">732</div>
            <div className="mt-2 text-sm font-semibold uppercase tracking-widest text-emerald-500">
              Trusted
            </div>
            <div className="mt-6 h-2 w-full rounded-full bg-slate-800">
              <div className="h-full w-[73.2%] rounded-full bg-amber-500" />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-3xl font-bold">How BitTrust Operates</h2>
        <div className="grid gap-8 md:grid-cols-4">
          {[
            {
              icon: Activity,
              title: "Index",
              desc: "Deep analysis of on-chain wallet activity and history."
            },
            {
              icon: BarChart3,
              title: "Compute",
              desc: "Engine calculates risk factors and credit metrics."
            },
            {
              icon: Lock,
              title: "Store",
              desc: "Scores are anchored to Bitcoin via Stacks L2."
            },
            {
              icon: Zap,
              title: "Query",
              desc: "Agents pay x402 micro-fees for instant verification."
            }
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-amber-500">
                {/* Fixed the icon usage here */}
                {i === 0 && <Activity className="h-6 w-6" />}
                {i === 1 && <BarChart3 className="h-6 w-6" />}
                {i === 2 && <Lock className="h-6 w-6" />}
                {i === 3 && <Zap className="h-6 w-6" />}
              </div>
              <h3 className="mb-2 font-bold">{step.title}</h3>
              <p className="text-sm text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold">Built for the Future of Finance</h2>
          <p className="mt-4 text-slate-400">Enabling trust in automated and autonomous systems.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "AI Agent Marketplaces",
              desc: "Bots hiring bots. Verification ensures execution before payment.",
              icon: Bot
            },
            {
              title: "DeFi Lending",
              desc: "Lower collateral requirements for wallets with high reputation scores.",
              icon: Coins
            },
            {
              title: "DAO Governance",
              desc: "Reputation-weighted voting to prevent Sybil attacks and promote experts.",
              icon: ShieldCheck
            }
          ].map((item, i) => (
            <Card key={i} className="matte-card">
              <CardHeader>
                <item.icon className="mb-2 h-8 w-8 text-amber-500" />
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* x402 / Builders Section */}
      <section className="container mx-auto max-w-5xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Monetize Your Reputation</h2>
            <p className="mt-4 text-slate-400">
              BitTrust implements the <span className="text-amber-500 font-semibold">x402 Protocol</span>,
              allowing you to earn micro-payments whenever an agent or protocol queries your trust score.
            </p>
            <ul className="mt-6 space-y-4">
              {[
                "Automated machine-to-machine revenue",
                "Privacy-preserving score disclosure",
                "Instant settlement on Stacks L2",
                "Developer-friendly REST API"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 font-mono text-[10px] text-slate-400 shadow-2xl">
            <div className="mb-4 flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500/50" />
              <div className="h-2 w-2 rounded-full bg-amber-500/50" />
              <div className="h-2 w-2 rounded-full bg-emerald-500/50" />
            </div>
            <p className="text-emerald-500">GET /reputation/ST123...456</p>
            <p className="mt-2 text-amber-500">HTTP/1.1 402 Payment Required</p>
            <p className="mt-1">X-Payment-Amount: 0.01 USDCx</p>
            <p className="mt-1">X-Stacks-Invoice: invoice_789...</p>
            <p className="mt-4 text-slate-500">// After autonomous payment...</p>
            <p className="mt-2 text-emerald-500">HTTP/1.1 200 OK</p>
            <div className="mt-1 text-slate-300">
              {"{"} <br />
              &nbsp;&nbsp;"score": 732, <br />
              &nbsp;&nbsp;"tier": "A", <br />
              &nbsp;&nbsp;"verified": true <br />
              {"}"}
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Final CTA */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/30 p-12 text-center">
        <h2 className="text-3xl font-bold">Ready to build your reputation?</h2>
        <p className="mt-4 text-slate-400">Join the decentralized trust network for Bitcoin.</p>
        <div className="mt-8">
          {isConnected ? (
            <Button asChild className="primary-btn px-10 py-6 text-lg">
              <Link href="/dashboard">
                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <Button onClick={connect} className="primary-btn px-10 py-6 text-lg">
              Connect Your Wallet
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
