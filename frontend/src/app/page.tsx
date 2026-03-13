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
  Activity,
  TerminalSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isConnected, connect } = useWallet();
  const router = useRouter();

  return (
    <div className="flex flex-col relative">
      {/* Hero Section: Asymmetrical Dashboard View */}
      <section className="container mx-auto px-4 md:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Copy & CTA */}
          <div className="flex flex-col items-start text-left max-w-2xl">
            <div className="mb-8">
              <Image
                src="/logo.png"
                alt="BitTrust Logo"
                width={400}
                height={120}
                className="h-auto w-80 object-contain"
                priority
              />
            </div>

            <div className="mb-6 font-mono text-[10px] md:text-xs text-slate-500 uppercase tracking-widest flex flex-wrap gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                STATUS: ONLINE
              </span>
              <span>NETWORK: STACKS_L2</span>
              <span>BLOCK: #142,912</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-100 leading-[1.1]">
              On-chain reputation for <br />
              <span className="text-amber-500">Bitcoin Wallets</span>
            </h1>

            <p className="mt-6 text-lg text-slate-400 leading-relaxed border-l-2 border-slate-800 pl-4">
              BitTrust indexes immutable blockchain activity to generate dynamic
              credit scores. We enable AI agents and DeFi protocols to verify
              counterparty reliability autonomously via the x402 protocol.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              {isConnected ? (
                <Button asChild className="primary-btn h-12 px-8 group">
                  <Link href="/dashboard">[ACCESS_DASHBOARD]</Link>
                </Button>
              ) : (
                <Button
                  onClick={connect}
                  className="primary-btn h-12 px-8 text-lg flex items-center gap-2 group"
                >
                  <TerminalSquare className="h-5 w-5" />
                  [INITIALIZE_CONNECTION]
                </Button>
              )}
              <Button
                variant="outline"
                className="secondary-btn h-12 px-8 border-slate-700 font-mono text-sm"
                onClick={() => router.push("/docs")}
              >
                [READ_DOCS]
              </Button>
            </div>
          </div>

          {/* Right: Detailed Mock Dashboard */}
          <div className="relative w-full max-w-[500px] mx-auto lg:ml-auto rounded-xl border border-slate-800 bg-[#050816] p-1 glow-amber shadow-2xl overflow-hidden">
            <div className="scanline" />

            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-4 py-3 rounded-t-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span className="font-mono text-xs font-bold text-slate-300">
                  ST123...89AB
                </span>
              </div>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                VERIFIED
              </span>
            </div>

            {/* Mock Content */}
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-mono text-slate-500 mb-1">
                    GLOBAL_TRUST_SCORE
                  </p>
                  <div className="text-7xl font-bold text-amber-500 tracking-tighter">
                    732
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-slate-500 mb-1">
                    TIER_CLASS
                  </p>
                  <div className="text-2xl font-bold text-slate-200">
                    A-CLASS
                  </div>
                </div>
              </div>

              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full w-[73.2%] bg-amber-500 shadow-[0_0_10px_#F7931A]" />
              </div>

              <div className="rounded border border-slate-800 bg-slate-950 p-3 font-mono text-[10px] text-slate-400 space-y-1.5">
                <p>
                  <span className="text-slate-500">
                    {"["}SYS{"]"}
                  </span>{" "}
                  Indexing latest blocks...
                </p>
                <p>
                  <span className="text-emerald-500">
                    {"["}OK{"]"}
                  </span>{" "}
                  Found 4 new transactions.
                </p>
                <p>
                  <span className="text-amber-500">
                    {"["}CALC{"]"}
                  </span>{" "}
                  Recalculating risk matrix...
                </p>
                <p>
                  <span className="text-emerald-500">
                    {"["}SYNC{"]"}
                  </span>{" "}
                  Score anchored to Stacks L2.
                </p>
                <p className="animate-pulse">_</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network Pulse Stats Bar */}
      <section className="border-y border-slate-800 bg-slate-900/30 backdrop-blur-md relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center lg:justify-between gap-6 md:gap-12 font-mono text-[10px] md:text-xs text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              TOTAL_WALLETS_INDEXED:{" "}
              <span className="text-slate-200 font-bold">42,910</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              AVG_REPUTATION:{" "}
              <span className="text-slate-200 font-bold">642/1000</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              API_QUERIES(24H):{" "}
              <span className="text-slate-200 font-bold">124,502</span>
            </div>
          </div>
        </div>
      </section>

      {/* Connected System Diagram (How it Works) */}
      <section className="container mx-auto px-4 py-24 relative z-10 max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-slate-100">
            Architecture Pipeline
          </h2>
          <p className="mt-2 text-slate-500 font-mono text-sm">
            How trust is computed and delivered.
          </p>
        </div>

        <div className="relative">
          {/* Background Connecting Line */}
          <div className="absolute top-12 left-0 w-full h-0.5 bg-slate-800 hidden md:block" />
          <div className="absolute top-12 left-0 w-1/2 h-0.5 bg-gradient-to-r from-amber-500/10 to-amber-500 shadow-[0_0_10px_#F7931A] hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {[
              {
                icon: Activity,
                title: "1. INDEX",
                desc: "Deep analysis of on-chain wallet activity and historical graph data.",
                log: "[API_OK: 12ms]",
              },
              {
                icon: BarChart3,
                title: "2. COMPUTE",
                desc: "Engine calculates risk factors using probabilistic models.",
                log: "[MATRIX_UPDATED]",
              },
              {
                icon: Lock,
                title: "3. STORE",
                desc: "Scores are anchored to Bitcoin via Clarity smart contracts.",
                log: "[TX_CONFIRMED]",
              },
              {
                icon: Zap,
                title: "4. QUERY",
                desc: "Agents pay micro-fees to unlock the data JSON via REST.",
                log: "[HTTP 200 OK]",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center group"
              >
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#050816] border-2 border-slate-800 text-slate-400 group-hover:text-amber-500 group-hover:border-amber-500/50 transition-colors relative">
                  <step.icon className="h-8 w-8" />
                  <div className="absolute inset-0 scanline rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="mb-2 font-mono font-bold tracking-tight text-slate-200">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 mb-3 px-2">{step.desc}</p>
                <div className="mt-auto font-mono text-[10px] text-emerald-500/70">
                  {step.log}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built For Section with Verification Badges */}
      <section className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-100">
            Built for Autonomous Finance
          </h2>
          <p className="mt-2 text-slate-400">
            Standardizing counterparty risk across the ecosystem.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              title: "AI Marketplaces",
              desc: "Bots hiring bots. Verification ensures high probability of execution before funds are released.",
              icon: Bot,
              badge: "EXECUTION_RISK: LOW",
            },
            {
              title: "DeFi Lending",
              desc: "Enable under-collateralized lending for wallets with proven repayment histories.",
              icon: Coins,
              badge: "COLLATERAL_REQ: -15%",
            },
            {
              title: "DAO Governance",
              desc: "Reputation-weighted voting to prevent Sybil attacks and promote subject matter experts.",
              icon: ShieldCheck,
              badge: "VOTING_POWER: 1.5x",
            },
          ].map((item, i) => (
            <Card
              key={i}
              className="matte-card hover:border-l-4 hover:border-amber-500 transition-all text-left"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <item.icon className="h-6 w-6 text-amber-500" />
                  </div>
                  <div className="font-mono text-[9px] text-emerald-500 border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded">
                    {item.badge}
                  </div>
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* High-Fidelity x402 Section */}
      <section className="container mx-auto px-4 py-24 relative z-10 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative rounded-xl border border-slate-800 bg-[#050816] overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-4 py-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-4 font-mono text-[10px] text-slate-500">
                agent_terminal_tty1
              </span>
            </div>
            <div className="p-6 font-mono text-[11px] sm:text-xs leading-relaxed text-slate-400 overflow-x-auto">
              <p>
                <span className="text-purple-400">agent@bot-09:~$</span> curl -i
                https://api.bittrust.network/v1/score/ST123...456
              </p>
              <br />
              <p className="text-amber-500 font-bold">
                HTTP/1.1 402 Payment Required
              </p>
              <p className="text-slate-300">
                Www-Authenticate: L402 macaroon="AgEEb...", invoice="lnbc..."
              </p>
              <p className="text-slate-300">Content-Type: application/json</p>
              <br />
              <p className="text-slate-500 italic">
                // Agent autonomously settles invoice via Stacks L2...
              </p>
              <br />
              <p>
                <span className="text-purple-400">agent@bot-09:~$</span> curl -i
                -H "Authorization: L402 AgEEb... lnbc..."
                https://api.bittrust.network/v1/score/ST123...456
              </p>
              <br />
              <p className="text-emerald-500 font-bold">HTTP/1.1 200 OK</p>
              <div className="mt-2 text-slate-300 pl-4 border-l border-slate-800">
                {"{"} <br />
                &nbsp;&nbsp;"address": "ST123...456", <br />
                &nbsp;&nbsp;"score": <span className="text-amber-500">732</span>
                , <br />
                &nbsp;&nbsp;"tier": "A-CLASS", <br />
                &nbsp;&nbsp;"flags": 0 <br />
                {"}"}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-mono font-bold mb-6">
              <Zap className="h-3 w-3" /> NATIVE MONETIZATION
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">
              The x402 Protocol
            </h2>
            <p className="mt-4 text-lg text-slate-400 leading-relaxed">
              We replace human subscriptions with machine-to-machine
              micro-payments. Agents pay a fraction of a cent to unlock your
              reputation data, creating a native revenue stream.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Automated agent-to-agent revenue generation",
                "Zero-knowledge privacy preservation",
                "Instant programmatic settlement",
                "No API keys required for consumers",
              ].map((text, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-slate-300 font-mono"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Terminal CTA */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto rounded-xl border border-slate-800 bg-[#050816] p-8 text-center glow-amber">
          <div className="font-mono text-sm text-slate-400 mb-6">
            <span className="text-emerald-500">sys</span>.
            <span className="text-amber-500">status</span> ==
            "READY_FOR_CONNECTION"
          </div>
          <h2 className="text-3xl font-bold text-slate-100 mb-4">
            Initialize Your Identity
          </h2>
          <p className="text-slate-500 mb-8">
            Join the foundational trust layer for the Bitcoin ecosystem.
          </p>

          <div className="flex justify-center">
            {isConnected ? (
              <Button
                asChild
                className="primary-btn px-12 py-6 text-lg font-mono"
              >
                <Link href="/dashboard">{">"} EXECUTE_DASHBOARD</Link>
              </Button>
            ) : (
              <Button
                onClick={connect}
                className="primary-btn px-12 py-6 text-lg font-mono flex items-center gap-2"
              >
                <TerminalSquare className="h-5 w-5" />
                {">"} CONNECT_WALLET
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
